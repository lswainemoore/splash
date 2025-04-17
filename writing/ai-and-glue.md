---
layout: post
title: AI is turning us into glue
date: 2025-04-17
---

### Not like that, probably.

I'm trying to learn to stop worrying and love the AGI, but I'm feeling pretty bleak about it.

I make software as my day job, and like basically everyone I know at this point, I've used LLMs to get some stuff done faster. o3 came out yesterday, and already it's helped me get to the bottom of a thorny bug, with a lot less trial and error than I would've needed otherwise. On its face, this is a good thing. So what's the problem?

Well, I like fixing thorny bugs! They're puzzles, and digging into them lets me learn about parts of the computer I usually don’t see. Same goes for refactoring--when I'm doing it right, I'm understanding the shape of my system better, and crystallizing that into a structure that expresses it. Solving these puzzles scratches an itch in my brain. I'm not sure it's the most rewarding part of my job, but it is the part I most enjoy.

I don't think we're quite there yet, but the writing is on the wall: *very* conservatively, within ten years, I'll be inferior to the computer at doing most tasks roughly shaped like "deep linear thinking about a concrete problem". 

When you excise that role from this work, you're left with two chunks that are mostly nonadjacent. There's ship-steering, and there's plumbing (forgive the mixed metaphors, here and throughout). When I hear from people who are excited about an AI-empowered future, they're universally talking about the former. The promise of vibe coding[^1] is that you only need to care about the top layer of the work--bring your sensibilities (idea / design / ethos) to the table, and the machine will do the rest for you. The human is freed to do the human work.

I've got a few ideas, and I can almost talk myself into liking that world.[^2] But in my experience, it's just not the full story for anything at all sophisticated. For one, even when using an agent with tools, there are issues that a human can see that the system cannot. If I'm building a web application, and Claude Code has written some styles for it per my prompting, I'm the one who needs to verify that it looks right in the browser. Inevitably it doesn't, becausee that's just how writing styles goes. And since I'm unfamiliar with the styles myself, not having written them, the easiest thing for me to do is bring the issue to Claude, and let it churn. Rinse and repeat. Writing up a bug is a lot less fun than fixing it, and makes me just another tool for Claude to navigate my computer: its eyes.

You might well object that this bit of cybernetic plumbing is not long for this world. The frontier labs are definitely working on full computer-use agents, which could handle tabbing over to the browser and checking things out as well as I could. Given how poor at spatial reasoning the best models remain, I feel like I've got a bit of moat.[^3] But even if I don't, there's plenty of plumbing left. In the short term, I'll still be the one who has to figure out how to pipe logs from one platform to another, or to configure the access policy on a storage bucket so that the agent's code can actually put stuff there. That's good for my job security, but unfortunately I don't much *like* doing those things. I'd much rather be thinking about the meat of my project than looking up 2FA codes for my nth cloud provider. But it'll get harder to justify that use of time versus the glue-like tasks.

The good (?) news is that In the slightly longer run, even that sort of role will get gobbled up. At that point, I see myself as the link between AI and the tangible world.[^4] For the foreseeable future, if I'm working on a hardware project, I'll be the one connecting jumper wires on a breadboard, or futzing with an antenna. I love tinkering, but it'll be a lot less fun when it's the computer who knows the game plan. If I'm lucky, I might be the Idea Captain steering the ship, but there'll only be so much steering to do before I need to consult an oracle about what to solder where. And I'm skeptical that everyone can make a living as the Idea Captain of their own ship.

I have no idea what's going to happen further down the line than that. Putting aside existential risks, I don't see a future where a lot of jobs don't cease to exist. The bullish case is that we'll create new ones we can't even imagine now, which empower people to self-actualize in ways they could never have before. But in a world of commoditized (super)intelligence, I worry that a lot of those new jobs will look like glue.



[^1]: Incidentally, something about this phrase rubs me wrong, but it already has a [Wikipedia page](https://en.wikipedia.org/wiki/Vibe_coding), so I suppose it's the term of art.

[^2]: I don't think I need to articulate its upsides, because they're pretty straightforward. There are lots of neat examples out there of people building things they couldn't have before.

[^3]: Though connecting arrows is not really what I like to think of as my specialized skillset. ![AI bad at arrows tweet from https://x.com/SpencerKSchiff/status/1910106368205336769](/img/arrows.jpeg)

[^4]: More generally, given the relatively slow progress of robotics compared to screen-based intelligence, we're headed toward a world where our embodiment remains our primary advantage over the machine, in all sorts of professions. Non-metaphorical plumbers (whose job, ironically, I'd guess more resembles bug-fixing than the sort of plumbing I've been talking about) are probably in good shape for a while, alongside a lot of other trade workers. And for some jobs that do become more glue-like, it might not feel quite as soulless as what I've been describing. For a trial lawyer, maybe it means being the deliverer of a case to the jury rather than the primary author of it. A doctor's bedside manner will grow in importance relative to diagnostic ability. (Let's not get into creative work, which I think will both benefit and suffer greatly from all of this.)