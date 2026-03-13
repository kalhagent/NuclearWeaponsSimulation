#!/usr/bin/env python3

"""Approximate Monte Carlo tuner for the crisis simulation.

This does not replay every authored prompt exactly. Instead, it models the
same main state pressures the browser game uses so we can estimate how often
different play styles land in positive, mixed, negative, or catastrophic
endings.

Usage:
  python3 balance_runner.py
  python3 balance_runner.py --runs 5000 --style peaceful
  python3 balance_runner.py --runs 5000 --style all
"""

from __future__ import annotations

import argparse
import random
from collections import Counter


PLAY_STYLES = ("peaceful", "mixed", "escalatory")


def clamp(value: int, low: int, high: int) -> int:
    return max(low, min(high, value))


def posture_for_turn(style: str, turn: int) -> str:
    if style == "peaceful":
        return "reasonable"
    if style == "escalatory":
        return "hardline"

    roll = random.random()
    if roll < 0.33:
        return "reasonable"
    if roll < 0.7:
        return "mixed"
    return "hardline"


def apply_reasonable(state: dict) -> None:
    state["relations"] += random.randint(2, 6)
    state["readiness"] -= random.randint(0, 3)
    state["stability"] += random.randint(0, 3)
    state["intel"] += random.randint(1, 4)
    state["defcon"] += random.choice([0, 0, 1, 1])
    state["reasonableChoiceCount"] += 1

    if random.random() < 0.35:
        state["verification"] = True
    if random.random() < 0.22:
        state["hotline_open"] = True
    if random.random() < 0.12:
        state["ceasefire"] = True


def apply_mixed(state: dict) -> None:
    state["relations"] += random.randint(-1, 3)
    state["readiness"] += random.randint(-1, 2)
    state["stability"] += random.randint(-1, 2)
    state["intel"] += random.randint(0, 3)
    state["defcon"] += random.choice([0, 0, 0, 1, -1])

    if random.random() < 0.18:
        state["media_leak"] = True
    if random.random() < 0.16:
        state["allies_reassured"] = True
    if random.random() < 0.15:
        state["hotline_open"] = True
    if random.random() < 0.08:
        state["verification"] = True


def apply_hardline(state: dict) -> None:
    state["relations"] -= random.randint(1, 5)
    state["readiness"] += random.randint(2, 5)
    state["stability"] += random.randint(-3, 2)
    state["intel"] += random.randint(-2, 2)
    state["defcon"] -= random.choice([0, 0, 1])
    state["hardlineChoiceCount"] += 1

    if random.random() < 0.25:
        state["strike_ready"] = True
    if random.random() < 0.18:
        state["hotline_cut"] = True
    if random.random() < 0.15:
        state["field_flexibility_granted"] = True
    if random.random() < 0.18:
        state["hotline_open"] = True


def apply_hidden_consequences(state: dict, posture: str) -> None:
    if posture == "reasonable":
        state["intelTrust"] += 4
        state["commandPressure"] -= 2
        state["publicCredibility"] += 3
        state["escalationMomentum"] -= 3
    elif posture == "mixed":
        state["intelTrust"] += random.randint(0, 2)
        state["commandPressure"] += random.randint(-1, 1)
        state["publicCredibility"] += random.randint(-1, 2)
        state["escalationMomentum"] += random.randint(-1, 1)
    else:
        state["intelTrust"] -= 2
        state["commandPressure"] += 5
        state["publicCredibility"] += random.randint(-2, 1)
        state["escalationMomentum"] += 5


def apply_contextual_friction(state: dict, posture: str, turn: int) -> None:
    if posture == "reasonable":
        chance = 0.12
        if state["reasonableChoiceCount"] >= 3:
            chance += 0.08
        if state["relations"] <= 50:
            chance += 0.08
        if state["commandPressure"] >= 60:
            chance += 0.1
        if state["publicCredibility"] <= 50:
            chance += 0.08
        if state["media_leak"]:
            chance += 0.1
        if state["hotline_cut"]:
            chance += 0.12
        if state["escalationMomentum"] >= 58:
            chance += 0.1
        if turn >= 6:
            chance += 0.06

        if random.random() < chance:
            state["relations"] -= random.randint(1, 4)
            state["readiness"] += random.randint(1, 3)
            state["stability"] -= random.randint(1, 3)
            state["defcon"] -= 1
            state["commandPressure"] += 7
            state["publicCredibility"] -= 5
            state["escalationMomentum"] += 10
            state["complicationCount"] += 1

        if (
            turn >= 6
            and (state["relations"] <= 45 or state["commandPressure"] >= 60 or state["publicCredibility"] <= 45)
            and random.random() < (0.18 + (0.08 if state["reasonableChoiceCount"] >= 5 else 0))
        ):
            state["relations"] -= 4
            state["readiness"] += 2
            state["stability"] -= 2
            state["defcon"] -= 1
            state["commandPressure"] += 6
            state["escalationMomentum"] += 7
            state["complicationCount"] += 1

    if posture == "hardline":
        chance = 0.18
        if state["stability"] <= 50:
            chance += 0.12
        if state["publicCredibility"] <= 50:
            chance += 0.08
        if state["relations"] <= 40:
            chance += 0.06

        if random.random() < chance:
            state["stability"] += 4
            state["relations"] += 5
            state["defcon"] += 1
            state["publicCredibility"] += 5
            state["escalationMomentum"] -= 4
            state["hardlineStabilizations"] += 1
            if random.random() < 0.45:
                state["hotline_open"] = True
            if random.random() < 0.3:
                state["ceasefire"] = True
            if random.random() < 0.12:
                state["verification"] = True


def apply_context_damping(state: dict, posture: str) -> None:
    if posture == "reasonable":
        if state["reasonableChoiceCount"] >= 2 and (state["relations"] <= 65 or state["commandPressure"] >= 45):
            state["defcon"] = min(state["defcon"], 4)
        if state["reasonableChoiceCount"] >= 2:
            state["relations"] -= 1
        if state["reasonableChoiceCount"] >= 4 and state["commandPressure"] >= 50:
            state["readiness"] += 2
        if state["reasonableChoiceCount"] >= 5 and state["publicCredibility"] <= 60:
            state["stability"] -= 2
        if state["hotline_cut"] or state["media_leak"]:
            state["defcon"] = min(state["defcon"], 4)
    elif posture == "hardline":
        if state["hardlineChoiceCount"] >= 1 and state["stability"] <= 55:
            state["stability"] += 2
        if state["hardlineChoiceCount"] >= 2 and state["publicCredibility"] <= 50:
            state["relations"] += 1
            state["defcon"] += 1


def normalize(state: dict) -> None:
    for key in (
        "relations",
        "readiness",
        "stability",
        "intel",
        "intelTrust",
        "commandPressure",
        "publicCredibility",
        "escalationMomentum",
    ):
        state[key] = clamp(state[key], 0, 100)
    state["defcon"] = clamp(state["defcon"], 1, 5)


def make_state() -> dict:
    return {
        "defcon": 4,
        "relations": 50,
        "readiness": 50,
        "stability": 55,
        "intel": 50,
        "intelTrust": 50,
        "commandPressure": 45,
        "publicCredibility": 50,
        "escalationMomentum": 40,
        "complicationCount": 0,
        "hardlineStabilizations": 0,
        "reasonableChoiceCount": 0,
        "hardlineChoiceCount": 0,
        "verification": False,
        "hotline_open": False,
        "hotline_cut": False,
        "ceasefire": False,
        "media_leak": False,
        "allies_reassured": False,
        "strike_ready": False,
        "field_flexibility_granted": False,
    }


def evaluate_outcome(state: dict) -> str:
    is_mostly_peaceful = state["reasonableChoiceCount"] >= state["hardlineChoiceCount"] + 3
    is_mostly_hardline = state["hardlineChoiceCount"] >= state["reasonableChoiceCount"] + 3
    is_truly_mixed = not is_mostly_peaceful and not is_mostly_hardline

    catastrophic = (
        state["defcon"] == 1
        and state["readiness"] >= 90
        and state["relations"] <= 18
        and state["escalationMomentum"] >= 84
        and state["commandPressure"] >= 78
    )
    if (
        state["reasonableChoiceCount"] >= 7
        and state["complicationCount"] >= 6
        and state["commandPressure"] >= 80
        and state["defcon"] <= 2
        and state["reasonableChoiceCount"] >= state["hardlineChoiceCount"] + 4
    ):
        catastrophic = True
    if state["complicationCount"] >= 5 and state["escalationMomentum"] >= 86 and state["defcon"] <= 2:
        catastrophic = True
    if (
        state["reasonableChoiceCount"] >= 8
        and state["complicationCount"] >= 5
        and state["commandPressure"] >= 78
        and state["publicCredibility"] <= 45
        and state["defcon"] <= 2
        and state["reasonableChoiceCount"] >= state["hardlineChoiceCount"] + 4
    ):
        catastrophic = True
    if (
        state["reasonableChoiceCount"] >= 12
        and state["complicationCount"] >= 4
        and state["commandPressure"] >= 68
        and state["defcon"] <= 2
    ):
        catastrophic = True
    if (
        state["complicationCount"] >= 4
        and state["escalationMomentum"] >= 80
        and state["defcon"] <= 3
        and (state["relations"] <= 40 or state["hardlineChoiceCount"] >= 4)
    ):
        catastrophic = True
    if (
        state["hardlineChoiceCount"] >= 7
        and state["readiness"] >= 78
        and state["relations"] <= 32
        and state["defcon"] <= 2
        and state["escalationMomentum"] >= 74
    ):
        catastrophic = True
    if state["hardlineChoiceCount"] >= 6 and state["readiness"] >= 88 and state["defcon"] == 1:
        catastrophic = True
    if (
        is_truly_mixed
        and state["defcon"] <= 2
        and state["readiness"] >= 80
        and state["escalationMomentum"] >= 78
        and state["complicationCount"] >= 4
    ):
        catastrophic = True
    if catastrophic:
        return "catastrophic"

    if (
        is_truly_mixed
        and state["defcon"] >= 2
        and state["relations"] >= 34
        and state["complicationCount"] <= 6
        and state["escalationMomentum"] <= 82
        and state["readiness"] <= 84
    ):
        if not (
            state["defcon"] >= 3
            and state["relations"] >= 50
            and state["complicationCount"] <= 2
            and state["escalationMomentum"] <= 60
            and (state["verification"] or state["hotline_open"] or state["ceasefire"] or state["hardlineStabilizations"] >= 2)
        ):
            return "mixed"

    mixed_negative = (
        is_truly_mixed
        and (
            (state["readiness"] >= 74 and state["relations"] < 40 and state["defcon"] <= 2)
            or (state["complicationCount"] >= 4 and state["escalationMomentum"] >= 80 and state["defcon"] <= 3)
        )
    )

    negative = (
        (
            not is_truly_mixed
            and state["readiness"] >= 68
            and state["relations"] < 48
            and state["defcon"] <= 3
        )
        or (
            not is_truly_mixed
            and state["complicationCount"] >= 3
            and state["escalationMomentum"] >= 74
        )
        or mixed_negative
        or (
            state["reasonableChoiceCount"] >= 7
            and state["complicationCount"] >= 2
            and state["relations"] < 60
            and state["defcon"] <= 3
            and state["reasonableChoiceCount"] >= state["hardlineChoiceCount"] + 3
        )
        or (
            state["reasonableChoiceCount"] >= 5
            and state["complicationCount"] >= 2
            and state["commandPressure"] >= 64
            and state["publicCredibility"] <= 60
            and state["defcon"] <= 4
            and state["reasonableChoiceCount"] >= state["hardlineChoiceCount"] + 2
        )
        or (
            state["reasonableChoiceCount"] >= 6
            and state["complicationCount"] >= 3
            and state["commandPressure"] >= 60
            and state["relations"] < 62
            and state["defcon"] <= 4
            and state["reasonableChoiceCount"] >= state["hardlineChoiceCount"] + 3
        )
        or (
            state["reasonableChoiceCount"] >= 10
            and state["complicationCount"] >= 2
            and state["relations"] < 72
            and state["commandPressure"] >= 56
            and state["defcon"] <= 4
            and state["reasonableChoiceCount"] >= state["hardlineChoiceCount"] + 4
        )
        or (
            state["reasonableChoiceCount"] >= 8
            and state["complicationCount"] >= 1
            and state["relations"] < 70
            and state["reasonableChoiceCount"] >= state["hardlineChoiceCount"] + 4
        )
        or (
            state["reasonableChoiceCount"] >= 9
            and state["complicationCount"] >= 2
            and state["relations"] < 80
            and state["defcon"] <= 4
            and state["reasonableChoiceCount"] >= state["hardlineChoiceCount"] + 4
        )
        or (
            state["reasonableChoiceCount"] >= 8
            and state["complicationCount"] >= 2
            and state["defcon"] <= 4
            and state["relations"] < 86
            and state["reasonableChoiceCount"] >= state["hardlineChoiceCount"] + 4
        )
        or (
            state["reasonableChoiceCount"] >= 7
            and state["complicationCount"] >= 2
            and state["commandPressure"] >= 58
            and state["defcon"] <= 4
            and state["reasonableChoiceCount"] >= state["hardlineChoiceCount"] + 3
        )
    )
    if negative:
        return "negative"

    positive = (
        state["defcon"] >= 3
        and state["relations"] >= 52
        and state["complicationCount"] <= 2
        and state["escalationMomentum"] <= 60
        and (state["verification"] or state["hotline_open"] or state["ceasefire"] or state["hardlineStabilizations"] >= 2)
    )
    if (
        state["hardlineStabilizations"] >= 4
        and state["hotline_open"]
        and state["defcon"] >= 3
        and state["relations"] >= 42
    ):
        positive = True
    if (
        is_truly_mixed
        and state["defcon"] >= 3
        and state["relations"] >= 50
        and state["complicationCount"] <= 2
        and state["escalationMomentum"] <= 62
        and (state["hotline_open"] or state["verification"] or state["ceasefire"])
    ):
        positive = True
    if positive:
        return "positive"

    return "mixed"


def run_once(style: str) -> str:
    state = make_state()
    turns = random.randint(15, 20)

    for turn in range(1, turns + 1):
        posture = posture_for_turn(style, turn)
        if posture == "reasonable":
            apply_reasonable(state)
        elif posture == "hardline":
            apply_hardline(state)
        else:
            apply_mixed(state)

        apply_hidden_consequences(state, posture)
        apply_contextual_friction(state, posture, turn)
        apply_context_damping(state, posture)
        normalize(state)

    return evaluate_outcome(state)


def run_many(style: str, runs: int) -> Counter:
    results = Counter()
    for _ in range(runs):
        results[run_once(style)] += 1
    return results


def print_results(style: str, results: Counter, runs: int) -> None:
    print(f"\nStyle: {style}")
    for bucket in ("positive", "mixed", "negative", "catastrophic"):
        count = results[bucket]
        pct = (count / runs) * 100
        print(f"  {bucket:12} {count:5d}  {pct:5.1f}%")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--runs", type=int, default=2000)
    parser.add_argument("--style", choices=("all",) + PLAY_STYLES, default="all")
    args = parser.parse_args()

    styles = PLAY_STYLES if args.style == "all" else (args.style,)
    for style in styles:
        print_results(style, run_many(style, args.runs), args.runs)


if __name__ == "__main__":
    main()
