# bayl.es design

How the `*.bayl.es` pages should look. This covers jordan.bayl.es, plus home, my and audible from the
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

Amber is too light for white text, so audible's buttons are ink on amber, and its prompt path uses a
darker amber (`--amber-text`).

## Color roles

| role    | light     | dark      | used for                                     |
| ------- | --------- | --------- | -------------------------------------------- |
| ink     | `#14282B` | `#D9E9E8` | text, the header rule                        |
| comment | `#6F8C8F` | `#6D9497` | secondary text, labels                       |
| line    | `#E4EBEC` | `#16353A` | hairlines between rows                       |
| ground  | `#FBFCFC` | `#0A1F22` | page background                              |
| pink    | `#E0457B` | `#F07EA6` | jordan.bayl.es signature                     |
| teal    | `#0087A0` | `#3DC5D6` | links, focus, private (LAN/tailnet) routes   |
| green   | `#00A36C` | `#55E0A6` | public, OK, selected, the user in the prompt |
| purple  | `#5B4BE0` | `#9184F5` | counts, section numbers                      |
| amber   | `#D99A00` | `#E8C07A` | needs attention, pending                     |
| orange  | `#E86A2C` | `#F2925C` | down, failed, destructive                    |

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

## Never

Cream or beige grounds · serif type (except the name on jordan.bayl.es) · bordered white cards as the
default container · drop shadows · gradients other than the signature strip · pill buttons ·
uppercase letter-spaced labels · emoji · color used only to decorate · Inter, Roboto, Arial, Geist.
