# bayl.es design

How the `*.bayl.es` pages should look. The [style guide](https://style.bayl.es) shows
all of this live. This covers jordan.bayl.es, plus home, my and audible from the
`unraid-config` repo, and the Pocket ID branding at id.bayl.es. The CSS lives in `src/`, and how to use
it is in README.md.

The idea is a code editor's color theme translated to the web. Color works like syntax highlighting,
and the type is a grotesk for words beside your editor's mono for machine facts. It should feel like
one family with a small context clue per site, and never like a stock template.

## Principles

- **Color means something.** Each hue is a role (links, public, counts, warnings), the same on every
  site. If a color carries no meaning, it is ink or grey.
- **Rules, not boxes.** Group with hairlines and space. A filled panel is for the one thing that
  needs to stand apart (a form, a first step, an alert), not for every item.
- **Words in Schibsted Grotesk, machine facts in Fira Code.** Hostnames, counts, states, section
  labels and the prompt line are mono. Prose, names and buttons are the sans. No mono paragraphs.
- **Every site has a signature.** One hue per site, fading into a neighbor, appears on the 4px top
  strip, the dot after the wordmark, the path in the prompt line, panels and the primary button.
- **The prompt line says where you are.** `user@eopsin:~/place` in mono above the wordmark, with
  the real signed-in user (`guest` before sign-in). It's the who-am-I and the breadcrumb in one line.
- **Dark is its own theme.** Deep teal-black with brighter role colors, the way an editor theme does
  it, not light mode inverted to grey.
- **Apps bring their own color.** Real app icons stay untinted. Without an icon, a letter tile takes
  the signature hue.

## Signatures

| site            | hue                             | prompt path                                      |
| --------------- | ------------------------------- | ------------------------------------------------ |
| jordan.bayl.es  | pink → purple                   | (no prompt line; the name is set in EB Garamond) |
| home.bayl.es    | teal → green                    | `jordan@eopsin:~`                                |
| my.bayl.es      | purple → teal                   | `guest@eopsin:~/accounts`                        |
| id.bayl.es      | purple (Pocket ID accent color) | n/a, third-party                                 |
| audible.bayl.es | amber → orange                  | `drake@eopsin:~/audible`                         |

id.bayl.es is Pocket ID, which only lets us set the name, logo, accent color, background image and
favicon. Its serif heading and pill button are built in, and accepted as the exception. Keep text out of
the background image: Pocket ID crops it to fit, so text gets cut off.

Amber is too light for white text, so audible's buttons are ink on amber, and its prompt path uses a
darker amber (`--amber-text`).

## Favicons

The server sites use an "e." monogram on a tile in the site's signature color (`icons/`), so their tabs
can be told apart at a glance. jordan.bayl.es uses the Chasma Sound logo, white on black.

## Color roles

| role    | light     | dark      | used for                                     |
| ------- | --------- | --------- | -------------------------------------------- |
| ink     | `#14282B` | `#D9E9E8` | text, the header rule                        |
| comment | `#576E71` | `#74999C` | secondary text, labels                       |
| line    | `#E4EBEC` | `#16353A` | hairlines between rows                       |
| ground  | `#FBFCFC` | `#0A1F22` | page background                              |
| pink    | `#E0457B` | `#F07EA6` | jordan.bayl.es signature                     |
| teal    | `#00748A` | `#3DC5D6` | links, focus, private (LAN/tailnet) routes   |
| green   | `#007B52` | `#55E0A6` | public, OK, selected, the user in the prompt |
| purple  | `#5B4BE0` | `#9184F5` | counts, section numbers                      |
| amber   | `#D99A00` | `#E8C07A` | needs attention, pending                     |
| orange  | `#B64914` | `#F2925C` | down, failed, destructive                    |

## Type

Schibsted Grotesk (400–700) and Fira Code (400, 500), both from Google Fonts. These were chosen on
2026-10-11 after comparing Mona Sans, Fira Sans, Bricolage Grotesque and Recursive. Geist and Inter
were dropped because they read as default.

| use                  | setting                                                                                |
| -------------------- | -------------------------------------------------------------------------------------- |
| wordmark             | sans 700, 56px (44px on phones), tracking −0.04em, followed by a signature-colored `.` |
| title                | sans 600, 24px, tracking −0.02em                                                       |
| lede                 | sans 400, 20px                                                                         |
| body                 | sans 400, 17px                                                                         |
| section label        | mono 12px, lowercase, purple number first (`01 shortcuts`)                             |
| meta, labels, footer | mono 12–13px                                                                           |

## Footer

Every site ends with the same footer: a row of mono links above a hairline. The site's own links come
first, and the last item is always `style.bayl.es`, which links to the style guide. It works as a
colophon and as the way back to these rules.

## Contrast

Accessibility is a requirement, not a polish step. Every pairing meets WCAG AA in both themes:

- **Text: 4.5:1 or better**, on the page _and_ on every tinted panel it can appear on (a panel tint
  is darker than the page, so passing on the page isn't enough). Sizes here are mostly 12–17px, so
  the large-text exemption (3:1) almost never applies.
- **Non-text: 3:1 or better** for anything you need to see to use the page: form field borders, focus
  rings, status dots, the active toggle.
- **Two strengths per hue.** The role colors (`--teal`, `--green`, `--orange`, `--amber-text`, ...) are
  text-safe. The `*-bright` variants and `--sig-fill`/`--sig2-fill` only clear 3:1, so use them for
  fills (the signature strip, dots, panel tints) and never for text.
- **Unavailable means grey, not faded.** Don't drop opacity on text to show a disabled state (45%
  opacity made names about 2.7:1). Use `--comment` text plus a label that says why ("home only").
- **White on a signature fill** must pass too. That's why audible's buttons are ink on amber.

When you add or change a color, check it against the page background and the darkest panel tint it
can sit on, in both themes. The live style guide (`docs/index.html`) shows the measured ratio under
every swatch for the current theme and site.

History: on 2026-10-11 an audit found light-mode text from 3.1:1 to 4.1:1 (the grey, green, teal,
orange and amber). v1.2.0 darkened them to about 5:1 while keeping each hue.

## Never

Cream or beige grounds · serif type (except the name on jordan.bayl.es) · bordered white cards as the
default container · drop shadows · gradients other than the signature strip · pill buttons ·
uppercase letter-spaced labels · emoji · color used only to decorate · Inter, Roboto, Arial, Geist.
