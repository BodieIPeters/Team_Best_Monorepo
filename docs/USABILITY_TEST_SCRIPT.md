# Usability Test: Church Match

Fall, 2026

Team Best

Ama Yeboah, Ryan Deaton, Beyla Ruzindana, Vitus Kaleo-Bioh, Bodie Peters

---

## Introduction

Thank you for agreeing to do this usability test for Church Match, an app that helps college students find a church near campus that fits them. You tell the app what you're looking for (denomination, worship style, how far you're willing to travel), and it suggests churches that match. You can also search and filter all the churches it knows about, save favorites, and leave comments to help other students. The team would like to see first-hand what it's like for real people to use the app, which we hope will help us improve it.

We're testing the app, not you. You can't do anything wrong here. We want to hear exactly what you think about the app. Be honest and don't worry about hurting our feelings. That will help us find problems that exist and will help us fix them.

For the test, we'll ask you to do certain tasks and we'd like you to think out loud while you're doing them: tell us what you're looking at, what you're trying to do, and what you expect to happen. If you have questions, just ask, though we may not answer right away, since we want to see how the app works on its own. If you have comments, go ahead and say them. We'll record your comments, but won't make them public. If, for any reason, you'd like to quit this test, then just say so.

A few things to know: the app is a prototype, so some parts (like accounts) are only partly built, and the churches shown are sample data for the Grand Rapids, MI area. You don't need to know anything about churches here. Please pretend you really are a student looking for a church, and pick whatever preferences feel natural to you.

---

## Background Questions

We presume that you're a college student who lives away from your hometown. Have you ever looked for a church or a similar community (small group, campus ministry, club) in a new place? How did you go about it (Google, Maps, friends, upperclassmen)? What matters most to you when you try a new church: beliefs, worship style, distance, friends who go, service times?

How often do you use phone apps to find local places or services?

Before we begin, do you have any questions for us?

---

## The Test

1. **Reactions to the first page** – Open the Church Match app and tell us your general impression of the first page. What do you think the app is for, and what would you do first? Please don't tap anything yet.

2. **General tasks** – I'll ask you to do some of the following tasks, depending on how much time we have together:

   a) You've just downloaded this app on the first day of the semester. Get yourself into the app so it knows who you are. *(Use made-up credentials. Please do not use any real username or password.)*

   b) You want a church with a more modern style of worship that you can get to without a car. Let the app know what you're looking for, and then pick one church from what it suggests that you'd actually like to visit this Sunday. Tell us its name, where it is, and when you could go.

   c) A friend told you about a church called Calvary Church. Find it.

   d) You decide you're only interested in Catholic churches that are close to campus, within about 3 miles. Tell us how many churches that leaves you.

   e) You want to keep track of a couple of churches that look good so you can find them again later. Save two of them and show us how you'd look at only the ones you saved. Then you change your mind about one of them, so take it off your list.

   f) Your roommate is also looking for a church. Send them the details of one of these churches so you can decide together.

   g) Suppose you visited one of these churches last Sunday and loved it. Leave a comment so other students can learn from your experience. Then you notice a typo in what you wrote, so fix it.

   h) A few weeks later, you realize you actually prefer a different worship style than you first told the app. Change what you told it and see whether the suggestions change.

   i) You don't want the app sending you reminders. Find out what the app knows about you, and make sure reminders are turned off.

   j) You're done for now, and you're on a friend's phone, so you don't want your information left on it. Can you log out? Then imagine you come back next week and can't remember your password. What does the app offer to help you get back in?

3. **Final observations** – Do you have any final observations on the app? Was there anything you expected to be able to do but couldn't? Would you consider using it to find a church?

---

## Thanks

Many thanks for your willingness to help us test the Church Match app. The app is still new, so we appreciate your help in fixing it.

We'll contact you soon with a summary of what we found and how we hope to use it to improve the app. We'll keep the data from your individual session private and will only release aggregate data.

---
---

## Facilitator Notes (not read aloud)

**Setup.** Start the server (`npm run server`) and client (`npm run client`) from the repo root, confirm the church list loads, and use a fresh app load for each participant. One person facilitates; one takes notes. Don't reload mid-session.

**Prototype limits to expect.** Sign-in accepts any non-empty username and any password. Favorites, comments, and quiz answers are kept in memory only, so a reload or log out clears them. Password reset only shows a confirmation message; no email is sent.

**Facilitating.** Don't explain how the app works or answer "how do I…?" questions; ask "What would you do if I weren't here?" and note where they got stuck. Step in only after about 3 minutes stuck on one task, and record the task as failed. Tasks a–g are the priority; use h–j if time allows.

**Tasks mapped to SRS user stories, with what to watch for**

| Task | SRS stories | Watch for |
|---|---|---|
| 1 | 1, 27 | Do they understand the purpose from the title and subtitle? Do they notice "How does this app work?" |
| 2a | 2, 22, 23 | Sign In vs. Register confusion. Reaction to any username working. |
| 2b | 3, 4, 5 | Quiz clarity, "Skip for now," whether they read the "fits everything" vs. "closest matches" note, whether they find address and service times. Quiz should take under 2 minutes. |
| 2c | 9 | Where they look for search; whether they know it works by name or ZIP. |
| 2d | 10, 11, worship-style filter (second #28) | Do they find the filters and combine them? What do they do on "No churches found"? |
| 2e | 13, 14 | "☆ Save" / "★ Saved" meaning, finding "My Favorites," realizing the same button removes a save. |
| 2f | 28 (share) | Do they find "Share"? Is the shared content what they expected? |
| 2g | 18, 19 (also 6, 17 partially) | "+ Leave Feedback," finding Edit/Delete, expecting star ratings. |
| 2h | 15, 26 | "Update Preferences" (results page and directory); reaction to pre-filled answers. |
| 2i | 20, 21 | Finding the Account button and notifications switch; noticing their saved quiz answers. |
| 2j | 24, 25 | Finding Log Out; finding "Forgot password?"; understanding the confirmation message. |

*Note: `docs/SRS.md` still lists stories 10, 19, 20, 21, 25, and 27 as not yet implemented, but the client already has the distance filter, comment edit/delete, the notifications switch, the forgot-password screen, and the "How does this app work?" box. The SRS also numbers two stories as #28. Consider updating the SRS to match.*

**Note-taking sheet**

| Task | Done? (Y / Partial / N) | Time | Hesitations / wrong turns | Quotes |
|---|---|---|---|---|
| 1 | | | | |
| 2a | | | | |
| 2b | | | | |
| 2c | | | | |
| 2d | | | | |
| 2e | | | | |
| 2f | | | | |
| 2g | | | | |
| 2h | | | | |
| 2i | | | | |
| 2j | | | | |
| 3 | | | | |
