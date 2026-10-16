## 1. Purpose
This document sets the coding rules for our team on Church Match. From now on, everyone follows these rules, so all of our code is written the same way.

Before you write or change any code, check this document first. If we all follow the same rules, we don't end up with five different ways of doing the same thing, and our code stays easy to read, easy to review, and easy to fix.

## 2. The standard we use
Our base reference is this Airbnb JavaScript Style Guide: https://github.com/airbnb/javascript

It covers JavaScript and TypeScript, so we use it for both the client (TypeScript) and the server (JavaScript). This document lists the rules our team cares about most. For anything not listed here, we follow the Airbnb guide.

Our one change: we use double quotes ("like this") instead of Airbnb's single quotes, because our existing code already uses them.

If this document and the Airbnb guide ever disagree, this document wins.

## 3. Naming
- Variables and functions use camelCase: `getChurches`, `selectedChurch`.
- React components and TypeScript types use PascalCase: `PreferenceQuiz`, `Item`.
- Constants that never change use UPPER_SNAKE_CASE: `API_URL`.
- Names must say what the thing is or does. Use `churchList`, not `x`. One-letter names are only OK in tiny loops (like `i`).
- Don't start or end a name with an underscore.
- File names: component files use PascalCase (`PreferenceQuiz.tsx`). Other code files use camelCase (`recommendedChurches.ts`). Screen files inside the `app/` folder follow the Expo Router rules (lowercase, like `index.tsx`).

## 4. Formatting
- Use 2 spaces for indentation. No tabs.
- Always end statements with a semicolon.
- Use double quotes for strings ("like this").
- Keep lines under about 100 characters. If a line is longer, break it up.
- In lists and objects that span several lines, put a comma after the last item too.
- Always use curly braces `{ }` for `if` statements, even for one line.
- Leave one blank line between functions. No more than one blank line in a row.

## 5. Variables and functions
- Use `const` by default. Use `let` only when the value will change. Never use `var`.
- Use `===` and `!==`. Never use `==` or `!=`.
- Use arrow functions for small inline functions: `items.map((item) => item.id)`.
- Use template strings instead of joining text with `+`: `Hello ${name}`.
- Keep functions short and focused. One function does one job.
- In TypeScript, avoid the `any` type. Say what the value really is (for example, `Item` or `string`).
- Client files use `import` and `export`. The server keeps using `require`, as it does today.
- Don't leave `console.log` lines in code that gets merged.

## 6. Comments
We use short `//` comments. There are two kinds:

**Interface comments** say what a function, component, or API endpoint does. Put one directly above each. Say what it does, what goes in, and what comes out, so someone can use it without reading the code.

```
// Returns the churches that match the student's quiz answers, best match first.
// Takes the list of answers the student picked.
function getRecommendedChurches(answers) {
```

**Implementation comments** explain tricky or non-obvious code inside a function. Say WHY the code does something, not just what it does. If a teammate would have to stop and think about a line, it needs a comment.

Other comment rules:
- Don't write comments that just repeat the code (like `// add 1` above `count + 1`).
- Keep comments up to date. If you change the code, change the comment.
- Don't delete old code we might need later, like hard-coded data. Comment it out or move it somewhere separate, and add a note saying why.
- The Lead Engineer checks that tricky code is documented before a pull request is merged.

## 7. Testing
- Every pull request that changes code must include tests for that change. No tests, no merge.
- We use Jest. Server tests also use Supertest to test the API.
- Vitest is a faster, drop-in replacement for Jest. We may switch to it later, but only if the whole team agrees and all existing tests move over at the same time. Until then, we do not mix the two tools.
- Server tests live in `server/__tests__/`. Test files end in `.test.js` or `.test.tsx` (the server only runs files named `.test.js`).
- Write unit tests for functions and components, and tests for each API endpoint. Use mock or hard-coded data instead of a real database.
- Name each test so it says what happens: given something, when something happens, then the result. Group related tests with `describe()`.
- Write the test first when you can (test-driven development).
- Before you open a pull request, run `npm test` in the folder you changed (`server` or `client`). All tests must pass, which also checks that old code still works (regression).
- Don't change an existing test just to make it pass. Add new tests instead. If an old test has to change, explain why in the pull request.
- The Lead Engineer runs the tests before merging.

## 8. Git and pull requests
- Never commit directly to `main`. Make a branch, do your work there, and open a pull request.
- Start every new branch from the latest `main` (run `git pull` on `main` first).
- Branch names are short, lowercase, and use hyphens, like `feature/preference-quiz` or `coding-standard`.
- Write clear commit messages that say what changed, like "Add quiz results screen".
- Keep pull requests small and about one thing.
- In the pull request description, say what you changed, which files, and which tests you added. Link the issue it finishes (for example, "Closes #12").
- Before you open a pull request, run the tests and make sure they pass.
- The Lead Engineer reviews each pull request, runs the tests, and checks that nothing breaks before merging.
- If a pull request has a merge conflict, the author fixes it. The Lead Engineer sends it back with a comment.
- Everyone helps review. Give kind, specific feedback, and reply to comments on your own pull requests.

## 9. Tools we will set up
We don't have automatic style checking yet. We will add two tools so the rules in this document are checked for us:
- **ESLint** is like a spell-checker for code. It reads our code and warns us when a rule is broken, for example if someone uses `var` instead of `const`. We will use it with the Airbnb rules.
- **Prettier** is like auto-format. When we save a file, it fixes the spacing, semicolons, and quotes for us, so the code always looks the same.

Adding these will change many lines in many files, so we will do it in its own pull request, after the current open pull requests are merged. It is tracked on our Kanban board. Until then, we follow this document by hand and check it during code review.