# Vipan Kumar portfolio website

Static site: plain HTML, CSS and a little JS. No build step or server. The only external script is Microsoft Clarity analytics (project `z8hk6c4tax`), added to the `<head>` of all 10 HTML files. Fonts are self-hosted (SIL Open Font License; licences in `assets/fonts/`).

## Preview locally

```
cd /Users/vipan/scripts/vipan
python3 -m http.server 8000
```
Open http://localhost:8000 and stop the server with Ctrl+C. Opening `index.html` directly also works.

## Files

- `index.html`: the consulting homepage. Hero, credibility strip, services, case-study cards, engagement models, about, recommendations, contact form.
- `experience.html`: career timeline, impact, industries, skills, education, public references.
- `work/*.html`: one case study per page (Dresma, Lenskart, OnGrid, SignCatch and Walmart KDP, Gigforce, DroneCraft, Maruti Suzuki RFID, ZodiacBee).
- `assets/`: CSS, JS, fonts, favicon, Open Graph image.
- `sitemap.xml`, `robots.txt`: for search engines (AI crawlers are explicitly allowed). `llms.txt`: a plain-text summary for AI answer engines.
- `.nojekyll`: keep this. It tells GitHub Pages to serve the files as they are.

Header and footer are repeated in each page, so a change there has to be made in all 10 HTML files. To change colours, edit the tokens at the top of `assets/css/site.css`.

## Links to send

| Send this to | Link |
|---|---|
| A founder or business leader | `https://vipan.me/` |
| Someone choosing how to work with you | `https://vipan.me/#engagement` |
| Someone who wants the full track record | `https://vipan.me/experience.html` |

Older links keep working: `assets/js/site.js` redirects `#consultant`, `#outsourcing`, `#path-leader`, `#path-builder`, `#career`, `#skills`, `#industries`, `#education` and `#references` on the homepage to their new locations.

## Contact form

GitHub Pages has no server, so the form cannot deliver a message itself. It builds a draft in the visitor's email app, says nothing has been sent until they press Send, and offers a copy button if no draft opens. To receive submissions directly, connect a form service with your own account and replace the submit handler in `assets/js/site.js`. Show a success message only when that service confirms delivery.

## Deploy (free; any one of these)

- **Cloudflare Pages or Netlify:** create a project and upload this folder. No build command.
- **GitHub Pages:** put this folder in a public repo, then Settings > Pages > deploy from branch, root.

Then do TODO 1 below and submit the sitemap in Google Search Console and Bing Webmaster Tools.

## TODOs for Vipan

### Before publishing

1. **Domain.** Set to `https://vipan.me` in every page, `sitemap.xml`, `robots.txt` and `llms.txt`. To change it later, replace `vipan.me` in those files and in the `CNAME` file.
4. **Confirm client names may be public.** The site names DroneCraft Rides and its billing figure, Maruti Suzuki, ZodiacBee, Walmart KDP and clients such as Delhivery and Flipkart. A website is public to anyone, including the clients.


### To make it stronger

6. **Add reference URLs.** Section 8 of the master names these sources without URLs, so they are plain text: SignCatch LinkedIn post, YourStory profile, PYMNTS, YourStory / Business Standard on Gigforce, Top Founders podcast, The eCommerce Edge E471, and the Lenskart, Koovs, V5 and Aricent milestones. Add each link in `index.html` (Public references) and on the matching case study page.
7. **LinkedIn recommendation.** The quote has no name because the source gives none. Add the recommender's name and title, with permission.
8. **Photo.** No photo is used. To add one, put it in `assets/` and add it to the hero in `index.html`, and to `"image"` in the JSON-LD.
9. **Screenshots or demos.** DroneCraft and Dresma especially; also a short sample DroneCraft film if the client agrees. The pages currently use drawn diagrams.
10. **Links to add if you want them:** GitHub or other public work, ZodiacBee.com (named but not linked because no URL is in the sources).
11. **Missing details, each left out rather than guessed:**
    - Maruti Suzuki RFID: software stack. The page lists only "Active RFID".
    - ZodiacBee: traffic or ranking results since launch.
    - SignCatch: a measured result from the microservices migration.
    - Domino's: setup cost or time reduction.
    - Koovs: a warehouse wastage figure (claim left out).
    - 2–3 references from OnGrid or Dresma, and remote/hybrid/onsite preference.

## Public profile consistency

Use "Vipan Kumar" everywhere so search engines connect the profiles. Add the site URL to LinkedIn once live. Section 9 of the master lists LinkedIn and Indeed dates and titles that need correcting; recruiters will compare them with this site.
