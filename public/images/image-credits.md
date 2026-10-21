# Image credits

All photography sits in `/public/images/`. Every file listed below ships with this project, is free of
watermarks, and is used only for hospitality marketing sections and product illustration.

## Photography currently in use

| Filename | Used on | Hotel subject | Credit |
| --- | --- | --- | --- |
| `banner1.jpg` | Home hero | Hotel room with city skyline at dusk | Supplied with the uploaded keto 1.0.0 site template pack |
| `banner2.jpg` | Available for hero rotation | Rooftop pool terrace at night | Supplied with the uploaded keto 1.0.0 site template pack |
| `banner3.jpg` | Available for hero rotation | Hotel exterior and pool | Supplied with the uploaded keto 1.0.0 site template pack |
| `about.png` | About and insight panels | Resort pool and gardens at dusk | Supplied with the uploaded keto 1.0.0 site template pack |
| `gallery1.jpg` to `gallery8.jpg` | Marketing gallery blocks | Hotel lounges, rooms and grounds | Supplied with the uploaded keto 1.0.0 site template pack |
| `room1.jpg` to `room6.jpg` | Room type illustration | Guest rooms and suites | Supplied with the uploaded keto 1.0.0 site template pack |
| `blog1.jpg` to `blog3.jpg` | Editorial blocks | Hospitality scenes | Supplied with the uploaded keto 1.0.0 site template pack |
| `blog_bg.jpg` | Section background | Hotel exterior at night | Supplied with the uploaded keto 1.0.0 site template pack |
| `logo.png` | Site icon fallback | Brand mark placeholder | Supplied with the uploaded keto 1.0.0 site template pack |
| `loading.gif` | Loading screen | Template preloader | Supplied with the uploaded keto 1.0.0 site template pack |

License confirmation: these images were provided inside the uploaded template archive, are used under the
terms of that template, carry no watermarks, and are not AI generated.

## Pexels sourcing status

The build environment for this deployment has outbound network access limited to the npm, PyPI and GitHub
registries. `images.pexels.com` and `api.pexels.com` are not reachable from it, and no `PEXELS_API_KEY` is
present, so no new Pexels asset could be downloaded during this build. Nothing was substituted with
generated imagery.

`next.config.ts` already allows `images.pexels.com` in `images.remotePatterns`, so the following Pexels
photographs can be dropped into `/public/images/` and swapped into the hero and marketing sections without
any code change beyond the `src` value. The search queries below are the ones specified for the brief.

| Intended slot | Pexels search query | Suggested filename |
| --- | --- | --- |
| Home hero, hotel lobby | `hotel lobby Kenya` | `hero-lobby-kenya.jpg` |
| Manager with tablet | `hotel manager tablet Africa` | `manager-tablet-africa.jpg` |
| Luxury property | `luxury hotel Nairobi` | `luxury-hotel-nairobi.jpg` |
| Reception | `hotel reception East Africa` | `reception-east-africa.jpg` |
| Team portrait | `hospitality team Kenya` | `hospitality-team-kenya.jpg` |

When those photographs are added, record the Pexels photo URL and photographer name in the table above, for
example `https://www.pexels.com/photo/xxxxxxx/`, photographer name, and the Pexels license confirmation
(free to use, no attribution required, no watermark, East African subjects as specified).
