---
id: zenops
title: zenops
date: 2026-03-10
tags: [ops, philosophy, sse]
links: [soft-stack-ecology, tool-farming]
---

zenops is a personal and team operations framework built around one core idea: systems are living things to tend to, not machines to optimise.

it grew out of frustration with ops culture that treats infrastructure like a performance problem that is always tuning, always scaling, and always chasing optimal output. zenops is the opposite being that it is slow, deliberate, and human.

## principles

**tend, don't optimise.** optimisation implies a finish line. tending implies ongoing care. a garden is never "optimised": it is watered, pruned, observed, and slightly adjusted. your systems deserve this same relationship, nurture them as you would your plants.

**boring is good.** boring systems are predictable, predictable systems are trustworthy, and trustworthy systems help you sleep. choose the dull tool that works over the exciting tool that might let you down.

**observable over clever.** if you can't read what your system is doing at a glance, it is too clever. plain logs, clear handoffs, legible runbooks. a system that only its author understands is a liability.

**deliberate pacing.** not everything needs to happen now. a change that can wait until the next morning probably should. remember: urgency is often a feeling, not a fact.

**clear handoffs.** whether handing off to a teammate or to your future self, leave the system in a state that requires no explanation. write the note, update the doc, and close the loop.

## in practice

on my own machines this looks like:

- flat dotfiles, commented and dated
- a single `~/bin/` for personal scripts, each one doing one thing
- a [[zettelmind]] for operational notes and runbooks
- git for everything, even my configs

on a team it looks like:

- runbooks, changelogs, or incident reports written at the time of the incident, not after
- on-call rotations that respect human time
- workflow post-mortems (removing dead or superfluous workflows)
- deploys that are boring on purpose in that they are dead simple

## roots

zenops sits inside the broader [[soft-stack-ecology]] framework alongside [[tool-farming]] and [[soft-circuits]]. it is the ops expression of the same philosophies: care-driven, human-scale, and repairable.

the name is deliberate, zen not as aesthetic but as one's disposition in being present, unhurried, and attentive to what is actually there.