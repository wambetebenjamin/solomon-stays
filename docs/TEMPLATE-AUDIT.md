# Template audit, keto 1.0.0

Printed before any code was written, as required by step 1 of the brief.

## File tree of the uploaded archive

```
keto-1.0.0/
├── .gitattributes
├── about.html
├── blog.html
├── contact.html
├── gallery.html
├── index.html
├── room.html
├── css/
│   ├── .DS_Store
│   ├── animate.min.css
│   ├── bootstrap-grid.css            bootstrap-grid.css.map
│   ├── bootstrap-grid.min.css        bootstrap-grid.min.css.map
│   ├── bootstrap-reboot.css          bootstrap-reboot.css.map
│   ├── bootstrap-reboot.min.css      bootstrap-reboot.min.css.map
│   ├── bootstrap.css                 bootstrap.css.map
│   ├── bootstrap.min.css             bootstrap.min.css.map
│   ├── default-skin.css
│   ├── font-awesome.min.css
│   ├── icomoon.css
│   ├── jquery-ui.css
│   ├── jquery.fancybox.min.css
│   ├── jquery.mCustomScrollbar.min.css
│   ├── meanmenu.css
│   ├── nice-select.css
│   ├── normalize.css
│   ├── owl.carousel.min.css
│   ├── responsive.css
│   ├── slick.css
│   └── style.css
├── fonts/
│   ├── FontAwesome.otf
│   ├── IcoMoon-Free.ttf
│   ├── Poppins-Black.ttf             Poppins-BlackItalic.ttf
│   ├── Poppins-Bold.ttf              Poppins-BoldItalic.ttf
│   ├── Poppins-ExtraBold.ttf         Poppins-ExtraBoldItalic.ttf
│   ├── Poppins-ExtraLight.ttf        Poppins-ExtraLightItalic.ttf
│   ├── Poppins-Italic.ttf
│   ├── Poppins-Light.ttf             Poppins-LightItalic.ttf
│   ├── Poppins-Medium.ttf            Poppins-MediumItalic.ttf
│   ├── Poppins-Regular.ttf
│   ├── Poppins-SemiBold.ttf          Poppins-SemiBoldItalic.ttf
│   ├── Poppins-Thin.ttf              Poppins-ThinItalic.ttf
│   ├── fontawesome-webfont.eot       .svg  .ttf  .woff  .woff2
├── images/
│   ├── .DS_Store
│   ├── about.png
│   ├── banner1.jpg  banner2.jpg  banner3.jpg
│   ├── blog1.jpg  blog2.jpg  blog3.jpg  blog_bg.jpg
│   ├── date.png
│   ├── gallery1.jpg ... gallery8.jpg
│   ├── loading.gif
│   ├── logo.png
│   ├── menu_icon.png
│   └── room1.jpg ... room6.jpg
└── js/
    ├── .DS_Store
    ├── bootstrap.bundle.js  bootstrap.bundle.js.map
    ├── bootstrap.bundle.min.js  bootstrap.bundle.min.js.map
    ├── bootstrap.js  bootstrap.js.map
    ├── bootstrap.min.js  bootstrap.min.js.map
    ├── custom.js
    ├── jquery-3.0.0.min.js
    ├── jquery.mCustomScrollbar.concat.min.js
    ├── jquery.min.js
    ├── jquery.validate.js
    ├── modernizer.js
    ├── plugin.js
    ├── popper.min.js
    ├── slider-setting.js
    └── revolution/
        ├── .DS_Store
        ├── assets/ (coloredbg.png, gridtile*.png, loader.gif)
        ├── css/ (closedhand.html, layers.css, navigation.css, openhand.html, settings.css)
        ├── fonts/ (pe-icon-7-stroke, revicons)
        └── js/ (jquery.themepunch.revolution.min.js, jquery.themepunch.tools.min.js,
                  extensions/*.min.js)
```

138 files total, including hidden `.DS_Store` and `.gitattributes`.

## CSS custom properties

`css/style.css`, `css/responsive.css` and `css/bootstrap*.css` declare **no** `--custom-property`
definitions. The template is built on literal hex values only. Palette recovered from every literal in
`style.css`:

| Literal | Role in template |
| --- | --- |
| `#ff0909` | Primary red accent, hover states, footer rule, copyright border |
| `#fe0000` | Red hover and active states, nav underline, book button |
| `#121212` | Headings, read more button background |
| `#0f1521` | Footer and inner page banner navy |
| `#f4f5f7` | Light grey room section surface |
| `#a3aec6` | Silver divider line |
| `#767676` | Lead paragraph grey |
| `#666666` | Body copy |
| `#111111`, `#1f1f1f`, `#212121`, `#222222`, `#010101`, `#000000` | Heading and link inks |
| `#ffffff`, `#ccc8c8`, `#fffffff2`, `#000000c7` | Surfaces and overlays |

The Solomon Stays build keeps every one of these literals and does not introduce a new accent. The red,
navy, grey and silver above are exposed as documented aliases in `/public/css/custom.css`
(`--ss-red: #ff0909`, `--ss-navy: #0f1521`, `--ss-grey: #f4f5f7`, `--ss-silver: #a3aec6`) so new components
cannot drift from the template.

## @font-face rules

| File | Family | src | Weight | Style |
| --- | --- | --- | --- | --- |
| `css/font-awesome.min.css` | `FontAwesome` | `../fonts/fontawesome-webfont.eot`, `.eot?#iefix`, `.woff2`, `.woff`, `.ttf`, `.svg#fontawesomeregular` | normal | normal |
| `js/revolution/fonts/pe-icon-7-stroke/css/pe-icon-7-stroke.css` | `Pe-icon-7-stroke` | `../fonts/Pe-icon-7-strokebb1d.eot`, `d41d.eot?#iefix`, `.woff`, `.ttf`, `.svg#Pe-icon-7-stroke` | normal | normal |

`style.css` additionally loads Google Fonts by `@import` for `Rajdhani` (300 to 700), `Poppins` (100 to 900
plus italics), `Raleway` and `Baloo Chettan`, and the template's own comment block names the two working
families: `'Rajdhani', sans-serif` and `'Poppins', sans-serif`.

The build adds self hosted `@font-face` rules for Poppins using the template's own TTF files, at weights 300,
400, 400 italic, 500, 600, 700 and 800. No family was swapped and no system font stack was introduced.
Rajdhani remains the numeric display face exactly as in the template.

## API routes present in the zip

None. The archive is a static HTML template with no server code, so every route in `app/api/` is new.

## Environment variables referenced in the zip

None. There is no `.env`, no `process.env` reference and no build tooling in the archive.

## Loading screen

Present. `index.html` opens with:

```html
<div class="loader_bg">
  <div class="loader"><img src="images/loading.gif" alt="#"/></div>
</div>
```

Styled in `style.css` at `.loader_bg` (fixed, `z-index: 9999999`, white) and `.loader`. Reproduced as
`components/preloader.tsx` with the same class names, the same `images/loading.gif`, and a percentage
counter below, `role="status"`, a one second skip and a three second hard stop.

## Cookie consent

Absent from the zip. Built per step 11: fixed bottom full width banner, Accept All and Manage Preferences,
a preferences modal with Necessary locked, Functional, Analytics and Marketing toggles, persisted under the
local storage key `solomon_stays_consent`, Kenya Data Protection Act 2019 wording, no decorative icons.

## CAPTCHA

Absent from the zip. Built per step 12: invisible Google reCAPTCHA v3 on contact and auth forms, server side
verification at `/api/recaptcha/verify`, reCAPTCHA v2 checkbox fallback when the score is below 0.5, and the
secret key read only from `RECAPTCHA_SECRET_KEY` on the server.

## Legal pages

`/legal/privacy-policy`, `/legal/terms` and `/legal/cookie-policy` are absent from the zip. All three are
built, styled on the template's inner page banner (`.back_re` equivalent) and legal typography.

## Error pages

`/404` and `/500` are absent from the zip. Both are built, with the template's red accent and navy, a
building icon on the 404 and the WhatsApp number on the 500.

## What was copied verbatim

`css/`, `fonts/` and `images/` are served from `/public` with file names unchanged, including the hidden
`.DS_Store` files that shipped in the archive. `index.html`, `about.html`, `blog.html`, `contact.html`,
`gallery.html` and `room.html` are replaced by App Router pages built from the same markup patterns, class
names, palette and type scale. No file was renamed or deleted from the template asset set.
