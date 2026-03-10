---
id: zenops
title: zenops
date: 2026-03-10
tags: [ops, philosophy, sse]
links: [soft-stack-ecology, tool-farming]
---

zenops is a personal and team operations framework built around one core idea: systems are living things to tend, not machines to optimize.

it grew out of frustration with ops culture that treats infrastructure like a performance problem — always tuning, always scaling, always chasing uptime percentages. zenops is the opposite of that. it is slow, deliberate, and human.

## principles

**tend, don't optimize.** optimization implies a finish line. tending implies ongoing care. a garden is never "optimized": it is watered, pruned, observed, adjusted. your systems deserve the same relationship.

**boring is good.** boring systems are predictable. predictable systems are trustworthy. trustworthy systems let you sleep. choose the dull tool that works over the exciting tool that might.

**observable over clever.** if you can't read what your system is doing at a glance, it is too clever. plain logs, clear handoffs, legible runbooks. a system that only its author understands is a liability.

**deliberate pacing.** not everything needs to happen now. a change that can wait until morning probably should. urgency is often a feeling, not a fact.

**clear handoffs.** whether handing off to a teammate or to your future self, leave the system in a state that requires no explanation. write the note. update the doc. close the loop.

## in practice

on my own machines this looks like:

- flat dotfiles, commented and dated
- a single `~/bin/` for personal scripts, each one doing one thing
- a [[zettelmind]] for operational notes and runbooks
- git for everything, even config
- no daemons i don't understand
- hyprlock and hypridle tuned so the machine behaves predictably

on a team it looks like:

- runbooks written at the time of the incident, not after
- on-call rotations that respect human time
- post-mortems that ask "what did the system make easy to miss?" not "who made the mistake?"
- deploys that are boring on purpose

## roots

zenops sits inside the broader [[soft-stack-ecology]] framework alongside [[tool-farming]] and soft circuits. it is the ops expression of the same philosophy: care-driven, human-scale, repairable.

the name is deliberate. zen not as aesthetic but as disposition: present, unhurried, and attentive to what is actually there.