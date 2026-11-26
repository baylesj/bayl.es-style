# bayl.es design

How the `*.bayl.es` pages should look. The [style guide](https://style.bayl.es) shows all of this live.
This covers jordan.bayl.es, the server sites from the `unraid-config` repo (home, my, audible, orbit,
zero, climb) and the Pocket ID branding at id.bayl.es. The CSS lives in `src/`, the galaxy in `js/galaxy.js`,
and how to use them is in README.md.

The idea is an instrument, not a storefront: a page reads like a README for a server, with a map at the
top. The map is after the Sensors Manager in Homeworld; the server, eopsin, is named for 업신, the Korean
goddess of storage and wealth, and the sites are the stars of the Big Dipper. The palette is
the editor-theme colors the sites already had, muted until nothing shouts.

## Principles

- **An instrument, not a storefront.** A map, plain controls, one column. No hero, no
  paragraph selling the system, no card grids, no pill buttons.
- **Color means something.** Each hue is a role (links, public, counts, warnings), the same on every
  site. If a color carries no meaning, it is ink or grey.
- **Muted, like starlight.** Every hue is dusty: chroma cut in OKLCH, contrast kept. The brightest
  thing on a page is a star.
- **One galaxy, a waypoint per site.** Every site opens on the same galaxy, seen almost edge-on and
  running off both edges of the page. The seven waypoints are the Big Dipper; the site you are on is
  lit in its star color and bracketed.
- **Keys measure what a site is for.** These sites serve people, so a scale measures the site's own
  subject (orbit: being in touch; zero: spending; climb: recovery; audible: backups), never the server. A site with
  nothing to measure has no scale.
- **Selection is a bracket.** Hover, the current choice and keyboard focus draw four thin corners, the
  way a selected contact looks on the map.
- **Words in Atkinson Hyperlegible Next, machine facts in its mono.** Hostnames, counts, states, labels,
  readouts and the prompt line are mono. Prose, names and buttons are the sans. No mono paragraphs.
- **The galaxy says where you are, once.** The lit waypoint and its label (`climb.bayl.es`) name the site; a small
  chip in the map's corner says who you are (`jordan@eopsin`, the real signed-in user, `guest` before sign-in;
  "eopsin" carries the goddess's name on hover) and holds the theme switch. The panel holds only the site's own
  controls, or isn't there. No prompt line, no wordmark, no caption repeating the waypoint: on a phone, every line
  said twice pushed the page down (2.2.0; before it, a prompt line and a wordmark sat in the panel).
- **Each page opens with what it's for.** Lead with the answer the page exists to give (today's call, am I on
  track, what to ride next); history, detail and stale sources go lower. The problem is never collecting data, it's
  making it useful.
- **No periods.** The wordmark, the name and the favicon end without a dot. A colored dot after a name
  reads as a brand mark.
- **Dark is its own theme.** Deep teal-black with brighter role colors, not light mode inverted. By
  day the map is slate with the galaxy etched on it.
- **The visitor picks the theme.** Sites follow the system until someone chooses, with the theme switch
  (`js/theme.js`) in each header; a choice made on one bayl.es site holds on all of them.
- **Apps bring their own color.** Real app icons stay untinted. Without an icon, a letter tile takes
  the signature hue.

## Signatures and stars

| site            | hue                      | star in the Dipper         | prompt path (pre-2.2.0)        |
| --------------- | ------------------------ | -------------------------- | ------------------------------ |
| home.bayl.es    | teal → green             | Dubhe                      | `jordan@eopsin:~`              |
| my.bayl.es      | purple → teal            | Merak                      | `guest@eopsin:~/accounts`      |
| id.bayl.es      | purple                   | Phecda                     | n/a, third-party               |
| audible.bayl.es | amber → orange           | Megrez                     | `drake@eopsin:~/audible`       |
| orbit.bayl.es   | pink → purple (jordan's) | Alioth                     | `jordan@eopsin:~/orbit`        |
| zero.bayl.es    | green → teal             | Mizar                      | `jordan@eopsin:~/zero`         |
| climb.bayl.es   | green → amber            | Alcor                      | `jordan@eopsin:~/climb`        |
| jordan.bayl.es  | pink → purple            | Alkaid                     | none; the name is in Geologica |
| binder.bayl.es  | purple → amber           | a field star: the Pleiades | none                           |

The site's full hue marks the prompt path, labels, panel tints, the selection bracket and the primary
button. Its **star** (`--star`) is the hue mixed 40% into starlight, the same in both themes: the lit
waypoint and the favicon star. A page with the galaxy header doesn't show the 4px signature strip; one
without it (kiwix, speedtest) still does.

**The eighth site**, climb, takes Alcor, the faint companion beside Mizar in the Dipper's handle, long used as a
test of eyesight.² In Chinese astronomy Alcor is 輔, the Assistant.³ Taoist tradition counts the Dipper
as nine: the seven stars and two not visible to the naked eye,⁴ so a ninth site takes the other unseen
one. The Dipper is for the main sites; a side project is a field star, however many sites there are.

**Field stars.** A side project (binder first) isn't one of the Dipper's stars. It is a star of its own in the
galaxy, drawn only on its own pages, lit and bracketed like a waypoint, so every other site's sky stays the Dipper.
Its favicon is the night tile with the Dipper unlit and its own star in the open top-right corner, without a halo.
Give a field star some meaning. binder.bayl.es is the Pleiades, 昴 (Subaru) in Japanese, "gathered together": a
cluster for the binder that gathers the cards, drawn as Alcyone lit with its sisters around it. It sits in the
Delta Quadrant, across the core from us and to the right (the far right of the plane), lifted clear of the Dipper.
`js/galaxy.js` takes a list of places for a field star and uses the first that is clear of the panel and `.who`,
since the thin header's shape changes with the width.

id.bayl.es is Pocket ID, which only lets us set the name, logo, accent color, background image and
favicon. Its serif heading and pill button are built in, and accepted as the exception. Keep text out of
the background image: Pocket ID crops it to fit, so text gets cut off.

Amber is too light for white text, so audible's buttons are ink on amber, and its text uses a darker
amber (`--amber-text`). Plain pink is too light for white text on it (3.8:1), so jordan and orbit use
`--pink-text` for text and the primary button.

## The galaxy

`js/galaxy.js` draws one galaxy from the fixed seed "eopsin": a plane seen almost edge-on (depth squashed
to 18%), six range rings and twelve spokes running off both edges, 560 stars in two loose arms and a
halo, and the seven waypoints on stalks to the plane, joined by a faint dashed star-chart line. The Dipper
keeps its own size (about 440px wide) in the open space beside the panel. Nothing is drawn under the
panel or the caption, and nothing moves.

At night the map sits on the page's ground in neutral starlight. By day it is slate (`--slate`: comment
grey with a little of the purple role, darkened toward ink) with the galaxy etched on it in pale lines,
after the Guidestone.

Hovering home's star on home.bayl.es names it.

## Favicons

Each site's favicon (`icons/`) is the Big Dipper on a night tile, edged in the site's hue, with the
site's own star lit and haloed, so tabs can be told apart and still read as one sky. jordan.bayl.es keeps
the Chasma Sound logo. Home Assistant (`icons/ha.svg`) keeps HA's own blue, `#18BCF2`, so it still reads as
HA, and carries the server's mark: 업 in Sunflower, in ink (white on that blue is under 3:1).
`scripts/icons.mjs` generates them all from the tokens.

## The name

eopsin, the server, is named for 업신 (Eopsin), the Korean household goddess of storage and wealth,
usually imagined as a rat snake.¹ On Jeju the wealth goddess is Chilseongsin, almost exactly the same as
the mainland Eopsin,¹ and chilseong (七星) means seven stars: the Big Dipper. The first seven bayl.es sites
are its stars; climb is Alcor, beside Mizar.

She is credited wherever the server's name appears: the footer says "served by eopsin, after 업신", with
업신 in Sunflower Bold, and "eopsin" in the prompt line names her on hover. Her name is ink, never a
signature color.

## Color roles

Each role is muted from the earlier palette: same hue, chroma cut to 60% in OKLCH, lightness moved only as
far as AA needs (on the page, on its own panel tint and under button text).

| role       | light     | dark      | used for                                     |
| ---------- | --------- | --------- | -------------------------------------------- |
| ink        | `#14282B` | `#D9E9E8` | text                                         |
| comment    | `#576E71` | `#74999C` | secondary text, labels                       |
| line       | `#E4EBEC` | `#16353A` | hairlines between rows                       |
| ground     | `#FBFCFC` | `#0A1F22` | page background                              |
| pink       | `#C16780` | `#D691A7` | jordan and orbit signature (fills)           |
| pink text  | `#A65069` | `#D691A7` | jordan and orbit text and button             |
| teal       | `#40707C` | `#7BBEC7` | links, focus, private (LAN/tailnet) routes   |
| green      | `#41745B` | `#8DD5B2` | public, OK, selected, the user in the prompt |
| purple     | `#5D5EB2` | `#928ED0` | counts, section numbers                      |
| amber      | `#C6A163` | `#DBC39B` | needs attention, pending (fills)             |
| amber text | `#7D653D` | `#DBC39B` | needs attention, as text                     |
| orange     | `#9C5C43` | `#D99F80` | down, failed, destructive                    |

## Type

Atkinson Hyperlegible Next (400–700) for words and Atkinson Hyperlegible Mono (400, 500) for machine
facts, both from Google Fonts. Atkinson was drawn so letters that look alike stay apart (Il1, O0), which
matters when most text is small. They replaced Schibsted Grotesk and Fira Code in v2.0.0.

| use                  | setting                                                         |
| -------------------- | --------------------------------------------------------------- |
| wordmark (pre-2.2.0) | sans 600, 22px; no period; sites now name themselves on the map |
| jordan.bayl.es name  | Geologica 200, sharpness 100, tracked +0.12em (`.name-mark`)    |
| title                | sans 600, 24px                                                  |
| body                 | sans 400, 16px                                                  |
| section label        | mono 12–13px, lowercase, purple number first (`01 shortcuts`)   |
| meta, labels, footer | mono 12–13px                                                    |
| the goddess's name   | Sunflower 700, only 업 and 신 loaded                            |

## Home Assistant

HA gets the same palette as a selectable theme (**bayl.es**), with home.bayl.es's teal signature and
green for "on". HA is built from cards, so cards sit on a slightly deeper page tone, with no borders or
shadows. Fonts are self-hosted in HA. The theme is generated from the tokens, so change colors in
`src/tokens.css`, never in the YAML.

## Footer

Every site ends with the same footer: a row of mono links above a hairline. The site's own links come
first, then the credit to the goddess the server is named for, and the last item is always
`style.bayl.es`, which links to the style guide.

## Influences

The header is after the Sensors Manager in Homeworld (Relic Entertainment, 1999), the view of the entire
game map with every visible ship.⁵ From it come the plane seen almost edge-on, its range rings, contacts
on stalks to the plane and the corner brackets around what is selected. Light mode is after the
Guidestone, the stone map in the same game that marks the way home:⁵ a blue-grey slate with the galaxy
etched on it in pale lines. Nothing is taken from the game: no art, no logos, no fonts.

## Contrast

Accessibility is a requirement, not a polish step. Every pairing meets WCAG AA in both themes:

- **Text: 4.5:1 or better**, on the page _and_ on every tinted panel it can appear on (a panel tint
  is darker than the page, so passing on the page isn't enough). Sizes here are mostly 12–16px, so
  the large-text exemption (3:1) almost never applies.
- **Non-text: 3:1 or better** for anything you need to see to use the page: form field borders, focus
  brackets, status dots, the lit star on the slate.
- **Two strengths per hue.** The role colors (`--teal`, `--green`, `--orange`, `--amber-text`,
  `--pink-text`, ...) are text-safe. `--pink`, `--amber` and the `*-bright` variants only clear 3:1, so
  use them for fills and never for text.
- **Unavailable means grey, not faded.** Don't drop opacity on text to show a disabled state. Use
  `--comment` text plus a label that says why ("home only").
- **Button text on a signature fill** must pass too. That's why audible's buttons are ink on amber.

When you add or change a color, check it against the page background and the darkest panel tint it
can sit on, in both themes. The live style guide (`docs/index.html`) measures every ratio for the current
theme and site.

History: on 2026-10-11 an audit found light-mode text from 3.1:1 to 4.1:1 (the grey, green, teal,
orange and amber); v1.2.0 darkened them to about 5:1 while keeping each hue. Pink was missed: on jordan
and orbit it was text at 3.85:1 and under white button text at 3.96:1, and amber text was 4.38:1 on panel
tints. v2.0.0 added `--pink-text`, darkened `--amber-text`, and muted the whole palette with every pair
re-checked.

## Never

Cream or beige grounds · a period after the wordmark, the name or the favicon letter · a hero or a
selling paragraph · card grids and bordered white cards as the default container · drop shadows ·
gradients other than the signature strip · pill buttons · uppercase letter-spaced labels · emoji ·
color used only to decorate · a key that measures the server on a site that serves people · motion in
the galaxy · Inter, Roboto, Arial, Geist.

## Sources

1. "Eopsin," Wikipedia, last modified October 11, 2026, https://en.wikipedia.org/wiki/Eopsin.
2. "Mizar and Alcor," Wikipedia, last modified June 18, 2026, https://en.wikipedia.org/wiki/Mizar_and_Alcor.
3. "List of Chinese Star Names," Wikipedia, accessed November 17, 2026,
   https://en.wikipedia.org/wiki/List_of_Chinese_star_names.
4. "Doumu," Wikipedia, last modified November 10, 2026, https://en.wikipedia.org/wiki/Doumu.
5. "Homeworld (video game)," Wikipedia, accessed November 17, 2026,
   https://en.wikipedia.org/wiki/Homeworld_(video_game).
