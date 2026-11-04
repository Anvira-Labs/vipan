# Vipan Kumar portfolio website

Static site: plain HTML, CSS and a little JS. No build step or server. The only external script is Microsoft Clarity analytics (project `z8hk6c4tax`), added to the `<head>` of all 9 HTML files. Fonts are self-hosted (SIL Open Font License; licences in `assets/fonts/`).

## Preview locally

```
cd /Users/vipan/scripts/portfolio_website
python3 -m http.server 8000
```
Open http://localhost:8000 and stop the server with Ctrl+C. Opening `index.html` directly also works.

## Files

- `index.html`: hero, audience modes, impact, full-time role evidence, case study list, career timeline, skills, education, public references, contact.
- `work/*.html`: one case study per page (Dresma, Lenskart, OnGrid, SignCatch and Walmart KDP, Gigforce, DroneCraft, Maruti Suzuki RFID, ZodiacBee).
- `assets/`: CSS, JS, fonts, favicon, Open Graph image, both CV PDFs.
- `sitemap.xml`, `robots.txt`: for search engines.
- `.nojekyll`: keep this. It tells GitHub Pages to serve the files as they are.

Header and footer are repeated in each page, so a change there has to be made in all 9 HTML files. To change colours, edit the tokens at the top of `assets/css/site.css`.

## Audience modes and links to send

The home page has three modes, each with its own link. Replace the domain once it is set:

| Send this to | Link |
|---|---|
| Someone who needs a consultant | `https://your-domain.example/#consultant` |
| Someone who wants a build handed to one owner | `https://your-domain.example/#outsourcing` |
| A startup hiring a senior person | `https://your-domain.example/#startup` |

- With no `#` in the link, the page opens on the startup mode. To change that, edit `data-default` on `.mode-tabs` in `index.html`.
- To edit a mode, change its section in `index.html` (`id="consultant"`, `id="outsourcing"`, `id="startup"`). All three are plain HTML. With JavaScript off they appear one after another.

## Deploy (free; any one of these)

- **Cloudflare Pages or Netlify:** create a project and upload this folder. No build command.
- **GitHub Pages:** put this folder in a public repo, then Settings > Pages > deploy from branch, root.

Then do TODO 1 below and submit the sitemap in Google Search Console and Bing Webmaster Tools.

## TODOs for Vipan

### Before publishing

1. **Set the final domain.** Every page, `sitemap.xml` and `robots.txt` use the placeholder `your-domain.example`. From this folder, replace it everywhere:
   ```
   grep -rl 'your-domain.example' . --include='*.html' --include='*.xml' --include='*.txt' | xargs sed -i '' 's#your-domain.example#YOURDOMAIN.com#g'
   ```
   A domain close to the name (for example one containing "vipankumar") helps people find you. Check availability yourself.
2. **Decide on the phone number.** It is not in the site's HTML, but **both CV PDFs show +1 742 778 0842**, so the number becomes public and searchable when the PDFs do. Options: accept it, or export CV copies without the phone number and replace the files in `assets/`.
3. **Check the Engineering Leader CV PDF against the site.** It says "Principal Engineering Consultant (Retainer)" where the site and the Hands-On CV say "Principal Software Architect (Consultant/Retainer)". It also shows "client-facing title: Associate Director of Engineering" for OnGrid, which the site does not use. Decide whether a public copy should say this.
4. **Confirm client names may be public.** The site names DroneCraft Rides and its billing figure, Maruti Suzuki, ZodiacBee, Walmart KDP and clients such as Delhivery and Flipkart, as your CVs do. A CV goes to one recruiter; a website is public to anyone, including the clients.

5. **Check the three modes.** These lines need your decision:
   - "Fixed scope" in the consultant headline: your sources show retainer work only, so keep it only if you offer fixed-scope work.
   - The DroneCraft billing figure now also appears in the outsourcing mode. If you remove it, remove it there, in the case study list and on the DroneCraft page.
   - The outsourcing mode says you personally own the build. If you bring in other people, reword it.

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
