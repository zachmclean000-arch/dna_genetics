# Locally stored reference assets

Collected on 2026-09-07 for the catalogue interface reconstruction.

- `images/logo/site-logo.webp`: https://dnagenetics.com/wp-content/uploads/2025/12/site-logo.webp
- `images/logo/footer-logo.webp`: https://dnagenetics.com/wp-content/uploads/2025/01/ft_logo.webp
- `images/footer/forest.webp`: https://dnagenetics.com/wp-content/themes/dnagenetics/images/order_pic-min.webp
- `images/homepage/banner-1.jpg`: https://dnagenetics.com/wp-content/uploads/2023/11/photo_2026-01-05_12-43-29.jpg
- `images/homepage/banner-2.jpg`: https://dnagenetics.com/wp-content/uploads/2024/11/photo_2026-08-27_17-05-45.jpg
- `images/header/megaicon1.webp`, `megaicon2.webp`: https://dnagenetics.com/wp-content/uploads/2025/01/megaicon1-min.webp and megaicon2-min.webp
- `fonts/knockout.woff2`: https://dnagenetics.com/wp-content/themes/dnagenetics/fonts/knockut-regular1.woff2
- `fonts/google-0.ttf`: Oswald 500, Google Fonts.
- `fonts/google-1.ttf`, `google-2.ttf`, `google-3.ttf`: Roboto 400, 500 and 700, Google Fonts.
- `fonts/fontawesome.woff2`: Font Awesome 4.7 font, https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/fonts/fontawesome-webfont.woff2?v=4.7.0 (font licensed under SIL OFL 1.1).

Reference branding and assets remain the property of their owners. Downloading these assets does not grant a commercial licence. They are served from this website, with no requests to the reference website at runtime. Original placeholder product packaging is separately generated SVG artwork in `images/products/`.

THCa section reference assets:
- `images/flower/choco-mintz.jpeg`: https://dnagenetics.com/wp-content/uploads/2025/12/DNA-THCa-Choco-mintz-600x600.jpeg
- `images/flower/gaz-money.jpeg`: https://dnagenetics.com/wp-content/uploads/2025/12/DNA-THCa-Gaz-Money-600x600.jpeg
- `images/flower/guavanade.jpeg`: https://dnagenetics.com/wp-content/uploads/2025/12/DNA-THCa-Guavanade-600x600.jpeg
- `images/flower/honey-beez.jpeg`: https://dnagenetics.com/wp-content/uploads/2025/12/DNA-THCa-Honey-beez-600x600.jpeg
- `images/flower/crown.png`: https://dnagenetics.com/wp-content/uploads/2024/01/crowh-h.png
- `images/flower/divider.webp`: https://dnagenetics.com/wp-content/themes/dnagenetics/images/devider.webp

The mobile section uses the reference's two-column grid variant consistently (the source randomly selects a grid or slider). Cards currently link to the local THCa information page while product detail work is pending.

Trusted section assets (source: https://dnagenetics.com/):
- `images/trusted/tear-bg-desk.webp`: https://dnagenetics.com/wp-content/themes/dnagenetics/images/tear-bg-desk.webp
- Other `images/trusted/` files retain their source filenames under https://dnagenetics.com/wp-content/uploads/2025/05/.
- The section uses adapted body copy; it is not a word-for-word reproduction. Its links use the local catalogue pending backend integration.

Latest-seeds section:
- `images/latest/seed-0.webp` through `seed-10.webp`: individual original source URLs are recorded alongside filenames in `frontend/src/data/latestSeeds.json`.
- Source: https://dnagenetics.com/ . Introductory copy is adapted. The carousel uses manual arrow, keyboard and touch scrolling; product links currently open the local new-arrivals catalogue.

Awards / USA collection section:
- `images/awards/genetics.webp`: https://dnagenetics.com/wp-content/uploads/2024/04/genetics-pic-min.webp
- `images/awards/background.webp`: https://dnagenetics.com/wp-content/themes/dnagenetics/images/award-bg-min.webp
- Headline and body copy are adapted for the catalogue storefront. Category links open the local catalogue; the reference's international purchase link is replaced with local brand information.

Classic Strains section:
- `images/classics/Blue_Dream.jpg`, `Green_Crack.jpg`, `White_Widow.jpg`, `GG4.jpg`: https://dnagenetics.com/wp-content/uploads/2024/04/DNA_Genetics_Blue_Dream-min.jpg and corresponding DNA_Genetics_{name}-min.jpg filenames.
- Introductory text is adapted. Card links open the local catalogue pending product/backend integration.

Guarantee section:
- `images/guarantee/background.webp`: https://dnagenetics.com/wp-content/uploads/2024/04/guranteed-bg-min-1.webp
- Other `images/guarantee/` artwork retains source filenames from https://dnagenetics.com/wp-content/themes/dnagenetics/images/ .
- Body copy is adapted for the catalogue storefront and makes no operational replacement promise. The button opens the local shop.

Brand story section:
- `images/story/video.webp`: https://dnagenetics.com/wp-content/uploads/2024/02/Video-Overlay.webp
- `images/story/scene.webp`: https://dnagenetics.com/wp-content/uploads/2024/04/Scene-Shot.webp
- `images/story/play.svg`: https://dnagenetics.com/wp-content/themes/dnagenetics/images/play.svg
- Story paragraphs are adapted. The reference Vimeo player (600180019) loads only when the visitor opens the video dialog and is removed on close. Browser interaction tests stub the remote player; they do not verify Vimeo playback availability.

Category collection, featured Chocolope and wholesale sections:
- `images/collections/` source image URLs are recorded in `reference/collection-assets.json`.
- `trusted-bg-min.webp` and `best-selling-bg.svg` retain their original filenames from https://dnagenetics.com/wp-content/themes/dnagenetics/images/ .
- Body copy is adapted for the catalogue storefront. Category, featured-product and contact links remain local. No wholesale submission or transaction is performed.

Promotions, guide thumbnail gallery, DNA Media and Skywalker banner:
- Original source URLs and local filenames are recorded in `frontend/src/data/homeMediaAssets.json`.
- `images/home-media/background.png`: https://dnagenetics.com/wp-content/themes/dnagenetics/images/marijuana-bg-min.png
- Promotion descriptions are adapted; artwork may show reference offers that are not active offers in this catalogue storefront.
- Both galleries open thumbnail previews only. No cultivation instructions or video playback are connected. Skywalker and promotion links stay within the local app.

Best sellers, Seed Vault Club, Media & Press, and The DNA Way:
- Local image source mapping: `reference/lower-home-assets.json`; display data: `frontend/src/data/lowerHome.json`.
- Reference prices are static visual content, not active sale or membership offers. Buttons navigate to local catalogue/information pages.
- Article headings, descriptions and brand summaries are adapted. Full articles are not reproduced; Read More links open local brand information.
- Seed Vault follows the reference's desktop-only visibility (hidden below 992px).

Reputation sections:
- `images/reputation/` filenames match the source under https://dnagenetics.com/wp-content/themes/dnagenetics/images/ .
- Review content is supplied by the local dashboard/database; reference customer reviews and verification badges are not copied.
- Recommendation logos are reference design assets. FAQ wording is adapted for the catalogue website.

About DNA page (`/about`):
- Source: https://dnagenetics.com/about/ . Original/local asset mappings and captured factual award records are in `frontend/src/data/aboutReference.json`.
- The history timeline summarizes 19 milestones from 2003 through 2021. Sidebar copy is adapted and links remain local.
- Trophy and event-logo galleries use reference assets. Award search filters the captured records; exact duplicate rows are omitted. This is a captured archive, not a live or exhaustive awards database.
- Verified with `node tests/check-about.mjs`: four viewport widths, timeline, trophy loading, award search and local navigation. Production build passed.


## Deals & Promos artwork

Reference: https://dnagenetics.com/promos/ (captured 2026-09-09). Static reference statuses; descriptions adapted.
- `/assets/images/promotions/offer-0.jpg`: https://dnagenetics.com/wp-content/uploads/2023/11/photo_2026-09-01_12-08-12.jpg
- `/assets/images/promotions/offer-1.webp`: https://dnagenetics.com/wp-content/uploads/2023/12/Free-Shipping-Over-120.webp
- `/assets/images/promotions/offer-2.jpg`: https://dnagenetics.com/wp-content/uploads/2026/08/2026-08-18-01.14.06.jpg
- `/assets/images/promotions/offer-3.jpg`: https://dnagenetics.com/wp-content/uploads/2023/11/photo_2026-06-30_16-40-34.jpg
- `/assets/images/promotions/offer-4.jpg`: https://dnagenetics.com/wp-content/uploads/2026/06/photo_2026-06-01_13-38-37-2.jpg
- `/assets/images/promotions/offer-5.jpg`: https://dnagenetics.com/wp-content/uploads/2026/03/photo_2026-04-03_15-34-58.jpg
- `/assets/images/promotions/offer-6.webp`: https://dnagenetics.com/wp-content/uploads/2026/02/promo-Feb2026.webp
- `/assets/images/promotions/offer-7.webp`: https://dnagenetics.com/wp-content/uploads/2025/12/promo-dec.webp
- `/assets/images/promotions/offer-8.webp`: https://dnagenetics.com/wp-content/uploads/2025/11/promo-aug.webp
- `/assets/images/promotions/offer-9.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/promo-October.webp
- `/assets/images/promotions/offer-10.webp`: https://dnagenetics.com/wp-content/uploads/2023/11/promo-sep.webp
- `/assets/images/promotions/offer-11.webp`: https://dnagenetics.com/wp-content/uploads/2025/08/promo-aug.webp
- `/assets/images/promotions/offer-12.webp`: https://dnagenetics.com/wp-content/uploads/2025/07/whitechocolate-promo.webp
- `/assets/images/promotions/offer-13.webp`: https://dnagenetics.com/wp-content/uploads/2025/06/honeybanana-promo-1.webp
- `/assets/images/promotions/offer-14.webp`: https://dnagenetics.com/wp-content/uploads/2025/04/image-2-removebg-preview.webp
- `/assets/images/promotions/offer-15.jpg`: https://dnagenetics.com/wp-content/uploads/2025/01/image-2.jpg
- `/assets/images/promotions/offer-16.jpg`: https://dnagenetics.com/wp-content/uploads/2024/09/DNA-Cake-Promo.jpg
- `/assets/images/promotions/offer-17.jpg`: https://dnagenetics.com/wp-content/uploads/2023/11/DNA_Strawberry_Sorbet_Promo_S.jpg
- `/assets/images/promotions/offer-18.webp`: https://dnagenetics.com/wp-content/uploads/2023/12/Nov-Promo-Pack-Banner.webp
- `/assets/images/promotions/offer-19.webp`: https://dnagenetics.com/wp-content/uploads/2023/12/DNA_December_Promo.webp
- `/assets/images/promotions/offer-20.webp`: https://dnagenetics.com/wp-content/uploads/2023/12/DNA-Genetics-Seed-Vault-Club-Banner-1.webp
- `/assets/images/promotions/offer-21.webp`: https://dnagenetics.com/wp-content/uploads/2023/12/Clifford-Box_DNA_Genetics.webp
- `/assets/images/promotions/offer-22.webp`: https://dnagenetics.com/wp-content/uploads/2023/12/Elons-X-Myalr.webp
- `/assets/images/promotions/offer-23.webp`: https://dnagenetics.com/wp-content/uploads/2023/12/DNA_Genetics_Cannabis_Seeds_in_usa.webp
- `/assets/images/promotions/offer-24.webp`: https://dnagenetics.com/wp-content/uploads/2023/12/DNA-Genetics-Free-Seeds-Box.webp
- `/assets/images/promotions/offer-25.webp`: https://dnagenetics.com/wp-content/uploads/2023/12/box-1.webp
- `/assets/images/promotions/offer-26.webp`: https://dnagenetics.com/wp-content/uploads/2023/12/hb-promo-sq1.webp
- `/assets/images/promotions/offer-27.webp`: https://dnagenetics.com/wp-content/uploads/2023/12/DNA-Genetics-Loyalty-DNA-Points-Scheme-Banner.webp
- `/assets/images/promotions/offer-28.webp`: https://dnagenetics.com/wp-content/uploads/2023/12/bonus-seed-square-1.webp


## Feminized Seeds product galleries

Individual product pages inspected on 2026-09-09. Details and pack prices are captured in `reference/feminized-product-records.json`. Descriptions are adapted; local inventory is not inferred from source availability.
- `/assets/images/catalogue/blue-dream-feminized-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/DNA_Genetics_Blue_Dream-min-1-768x768-1.webp (product: https://dnagenetics.com/product/blue-dream-feminized/)
- `/assets/images/catalogue/white-widow-feminized-0.png`: https://dnagenetics.com/wp-content/uploads/2024/03/photo_2026-07-15_02-03-05-1.png (product: https://dnagenetics.com/product/white-widow-feminized/)
- `/assets/images/catalogue/chocolope-fem-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/DNA-Genetics-Chocolope-1-min-768x768-1.webp (product: https://dnagenetics.com/product/chocolope-fem/)
- `/assets/images/catalogue/chocolope-fem-1.webp`: https://dnagenetics.com/wp-content/uploads/2024/02/DNA-Genetics-Chocolope-1-min-1-768x768-2-1.webp (product: https://dnagenetics.com/product/chocolope-fem/)
- `/assets/images/catalogue/chocolope-fem-2.webp`: https://dnagenetics.com/wp-content/uploads/2024/02/Chocolope-2-min-768x1024-min-1-1.webp (product: https://dnagenetics.com/product/chocolope-fem/)
- `/assets/images/catalogue/kosher-kush-fem-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/Kosher_Kush_DNA_Genetics-768x768-min-1.webp (product: https://dnagenetics.com/product/kosher-kush-fem/)
- `/assets/images/catalogue/green-crack-feminized-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/DNA_Genetics_Green_Crack-min-1-768x768-1.webp (product: https://dnagenetics.com/product/green-crack-feminized/)
- `/assets/images/catalogue/rp-43-aka-richard-petty-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/RP43_DNA_Genetics-300x300-1.webp (product: https://dnagenetics.com/product/rp-43-aka-richard-petty/)
- `/assets/images/catalogue/rp-43-aka-richard-petty-1.webp`: https://dnagenetics.com/wp-content/uploads/2023/11/DNA_Genetics_RP43_Richard_Petty-300x300-min.webp (product: https://dnagenetics.com/product/rp-43-aka-richard-petty/)
- `/assets/images/catalogue/dna-mystery-pack-0.webp`: https://dnagenetics.com/wp-content/uploads/2024/07/photo_2026-01-22_02-47-26.webp (product: https://dnagenetics.com/product/dna-mystery-pack/)
- `/assets/images/catalogue/dna-mystery-pack-1.webp`: https://dnagenetics.com/wp-content/uploads/2024/12/dna-genetics-seed-placeholde-1-768x803-1.webp (product: https://dnagenetics.com/product/dna-mystery-pack/)
- `/assets/images/catalogue/challah-bread-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/04/DNA_Genetics_Challah_Bread.webp (product: https://dnagenetics.com/product/challah-bread/)
- `/assets/images/catalogue/challah-bread-1.png`: https://dnagenetics.com/wp-content/uploads/2023/11/Four-Prophets-by-DNA-Genetics-300x300-1-2.png (product: https://dnagenetics.com/product/challah-bread/)
- `/assets/images/catalogue/challah-bread-2.png`: https://dnagenetics.com/wp-content/uploads/2023/11/Four-Prophets-by-DNA-Genetics-300x300@2x-3.png (product: https://dnagenetics.com/product/challah-bread/)
- `/assets/images/catalogue/challah-bread-3.png`: https://dnagenetics.com/wp-content/uploads/2023/11/3peat-tree-1-2.png (product: https://dnagenetics.com/product/challah-bread/)
- `/assets/images/catalogue/cataract-cake-feminized-cannabis-seeds-0.webp`: https://dnagenetics.com/wp-content/uploads/2024/12/DNA_Genetics_Cataract_Cake-768x768-1.webp (product: https://dnagenetics.com/product/cataract-cake-feminized-cannabis-seeds/)
- `/assets/images/catalogue/double-stuffed-sorbet-0.webp`: https://dnagenetics.com/wp-content/uploads/2024/07/DNA_Genetics_Double_Stuffed_Sorbet-768x768-1.webp (product: https://dnagenetics.com/product/double-stuffed-sorbet/)
- `/assets/images/catalogue/honey-banana-s1-0.webp`: https://dnagenetics.com/wp-content/uploads/2023/11/Honey_Banana_S1_DNA_Genetics-1.webp (product: https://dnagenetics.com/product/honey-banana-s1/)
- `/assets/images/catalogue/honey-banana-s1-1.jpg`: https://dnagenetics.com/wp-content/uploads/2023/11/DNA_Genetics_Honey_Banana_S1-1.jpg (product: https://dnagenetics.com/product/honey-banana-s1/)
- `/assets/images/catalogue/l-a-chocolat-feminized-cannabis-seeds-0.webp`: https://dnagenetics.com/wp-content/uploads/2024/12/DNA-Genetics-La-Chocolat-1-2.webp (product: https://dnagenetics.com/product/l-a-chocolat-feminized-cannabis-seeds/)
- `/assets/images/catalogue/four-prophets-fem-0.webp`: https://dnagenetics.com/wp-content/uploads/2024/02/Four_Prophets_DNA_Genetics-1-2.webp (product: https://dnagenetics.com/product/four-prophets-fem/)
- `/assets/images/catalogue/gelato-sorbet-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/DNA_Genetics_Gelato_Sorbet-768x768-1.webp (product: https://dnagenetics.com/product/gelato-sorbet/)
- `/assets/images/catalogue/bruised-bananas-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/Bruised_Bananas_DNA_Genetics-1-768x768-1.webp (product: https://dnagenetics.com/product/bruised-bananas/)
- `/assets/images/catalogue/bruised-bananas-1.jpg`: https://dnagenetics.com/wp-content/uploads/2023/11/DNA-Genetics-Seed-Placeholder-600x600-1.jpg (product: https://dnagenetics.com/product/bruised-bananas/)
- `/assets/images/catalogue/double-dipped-strawberry-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/Double-Dipped-Strawberries-DNA-Genetics-768x768-1.webp (product: https://dnagenetics.com/product/double-dipped-strawberry/)
- `/assets/images/catalogue/double-dipped-strawberry-1.jpg`: https://dnagenetics.com/wp-content/uploads/2023/11/Double_Dipped_Strawberries-1.jpg (product: https://dnagenetics.com/product/double-dipped-strawberry/)
- `/assets/images/catalogue/chocolope-256-fem-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/Chocolope_256_DNA_Genetics-1-768x768-1.webp (product: https://dnagenetics.com/product/chocolope-256-fem/)
- `/assets/images/catalogue/chocolope-256-fem-1.webp`: https://dnagenetics.com/wp-content/uploads/2024/02/DNA_Genetics_Chocolope_256-768x768-1.webp (product: https://dnagenetics.com/product/chocolope-256-fem/)
- `/assets/images/catalogue/3peat-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/3peat_DNA_Genetics-300x300-1-1.webp (product: https://dnagenetics.com/product/3peat/)
- `/assets/images/catalogue/3peat-1.webp`: https://dnagenetics.com/wp-content/uploads/2023/11/DNA_Genetics_3Peat-300x300-min.webp (product: https://dnagenetics.com/product/3peat/)
- `/assets/images/catalogue/kosher-dawg-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/DNA_Genetics_Kosher_Dawg-768x768-2.webp (product: https://dnagenetics.com/product/kosher-dawg/)
- `/assets/images/catalogue/sour-garlic-x-honey-banana-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/Sour_Garlic_Honey_Banana_DNA_Genetics-1-768x768-1.webp (product: https://dnagenetics.com/product/sour-garlic-x-honey-banana/)
- `/assets/images/catalogue/sour-garlic-x-honey-banana-1.jpg`: https://dnagenetics.com/wp-content/uploads/2023/11/DNA-Genetics-Seed-Placeholder-600x600-1.jpg (product: https://dnagenetics.com/product/sour-garlic-x-honey-banana/)
- `/assets/images/catalogue/chocolate-truffle-shuffle-fem-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/04/chocolate-truffle-shuffle-fem.webp (product: https://dnagenetics.com/product/chocolate-truffle-shuffle-fem/)
- `/assets/images/catalogue/chocolate-truffle-shuffle-fem-1.jpeg`: https://dnagenetics.com/wp-content/uploads/2023/11/DNA_Genetics_C.T.S.jpeg (product: https://dnagenetics.com/product/chocolate-truffle-shuffle-fem/)
- `/assets/images/catalogue/kosher-pie-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/DNA_Genetics_Kosher_Pie-768x768-1.webp (product: https://dnagenetics.com/product/kosher-pie/)
- `/assets/images/catalogue/recon-2-0-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/processed-dc62fc5e-9d55-40eb-8c46-a84b5f0b6bbf_2pii0Wf8-1-1-768x768-1.webp (product: https://dnagenetics.com/product/recon-2-0/)
- `/assets/images/catalogue/gorilla-glue-4-feminized-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/DNA_Genetics_GG4-min-1.webp (product: https://dnagenetics.com/product/gorilla-glue-4-feminized/)
- `/assets/images/catalogue/gorilla-glue-4-feminized-1.jpeg`: https://dnagenetics.com/wp-content/uploads/2023/11/DNA_Genetics_Purple_Kosher.jpeg (product: https://dnagenetics.com/product/gorilla-glue-4-feminized/)
- `/assets/images/catalogue/purple-chocolope-0.webp`: https://dnagenetics.com/wp-content/uploads/2023/11/DNA-Genetics-Purple-Chocolope-768x768-2.webp (product: https://dnagenetics.com/product/purple-chocolope/)
- `/assets/images/catalogue/purple-chocolope-1.jpeg`: https://dnagenetics.com/wp-content/uploads/2023/11/DNA_Genetics_Purple_Kosher.jpeg (product: https://dnagenetics.com/product/purple-chocolope/)
- `/assets/images/catalogue/dna-cake-fem-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/DNA_Cake_DNA_Genetics-300x300-1-1.webp (product: https://dnagenetics.com/product/dna-cake-fem/)
- `/assets/images/catalogue/dna-cake-fem-1.png`: https://dnagenetics.com/wp-content/uploads/2023/11/Four-Prophets-by-DNA-Genetics-300x300@2x-1-1.png (product: https://dnagenetics.com/product/dna-cake-fem/)
- `/assets/images/catalogue/dna-cake-fem-2.jpeg`: https://dnagenetics.com/wp-content/uploads/2023/11/DNA_Genetics_Challah_Bread-768x768-1-1.jpeg (product: https://dnagenetics.com/product/dna-cake-fem/)
- `/assets/images/catalogue/strawberry-sorbet-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/DNA_Genetics_Strawberry_Sorbet.webp (product: https://dnagenetics.com/product/strawberry-sorbet/)
- `/assets/images/catalogue/swiss-miss-fem-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/Swiss_Miss_DNA_Genetics.webp (product: https://dnagenetics.com/product/swiss-miss-fem/)
- `/assets/images/catalogue/swiss-miss-fem-1.jpeg`: https://dnagenetics.com/wp-content/uploads/2024/07/DNA_Genetics_Swiss_Miss.jpeg (product: https://dnagenetics.com/product/swiss-miss-fem/)
- `/assets/images/catalogue/strawberry-banana-s1-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/DNA-Genetics-Strawberry-Banana-S1-300x300-1.webp (product: https://dnagenetics.com/product/strawberry-banana-s1/)
- `/assets/images/catalogue/zallah-bread-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/DNA_Genetics_Zallah_Bread.webp (product: https://dnagenetics.com/product/zallah-bread/)
- `/assets/images/catalogue/skywalker-kush-fem-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/DNA_Genetics_Skywalker_Kush.webp (product: https://dnagenetics.com/product/skywalker-kush-fem/)
- `/assets/images/catalogue/bakers-delight-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/DNA_Genetics_Bakers_Delight.webp (product: https://dnagenetics.com/product/bakers-delight/)
- `/assets/images/catalogue/you-whoo-fem-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/You_Whoo_DNA_Genetics-2.webp (product: https://dnagenetics.com/product/you-whoo-fem/)
- `/assets/images/catalogue/you-whoo-fem-1.jpeg`: https://dnagenetics.com/wp-content/uploads/2024/02/DNA_Genetics_You_Whoo.jpeg (product: https://dnagenetics.com/product/you-whoo-fem/)
- `/assets/images/catalogue/the-stinking-rose-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/DNA_Genetics_The_Stinking_Rose-1.webp (product: https://dnagenetics.com/product/the-stinking-rose/)
- `/assets/images/catalogue/challah-cake-0.webp`: https://dnagenetics.com/wp-content/uploads/2023/12/Challah-Cake-DNA-Genetics-768x768-1.webp (product: https://dnagenetics.com/product/challah-cake/)
- `/assets/images/catalogue/challah-cake-1.png`: https://dnagenetics.com/wp-content/uploads/2023/12/challah-nugshot-1229x1536-1.png (product: https://dnagenetics.com/product/challah-cake/)
- `/assets/images/catalogue/chocolope-kush-0.webp`: https://dnagenetics.com/wp-content/uploads/2024/07/Chocolope-Kush-FEM-Cannabis-Seeds.webp (product: https://dnagenetics.com/product/chocolope-kush/)
- `/assets/images/catalogue/auto-bahn-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/04/Autobahn_DNA_Genetics.webp (product: https://dnagenetics.com/product/auto-bahn/)
- `/assets/images/catalogue/auto-bahn-1.jpg`: https://dnagenetics.com/wp-content/uploads/2023/11/DNA_Genetics_Autobahn.jpg (product: https://dnagenetics.com/product/auto-bahn/)
- `/assets/images/catalogue/banana-sorbet-feminized-cannabis-seeds-0.webp`: https://dnagenetics.com/wp-content/uploads/2024/12/DNA_Genetics_Banana_Sorbet.webp (product: https://dnagenetics.com/product/banana-sorbet-feminized-cannabis-seeds/)
- `/assets/images/catalogue/hg23-aka-michael-jordan-fem-0.webp`: https://dnagenetics.com/wp-content/uploads/2024/02/HG23_Fem_DNA_Genetics-1.webp (product: https://dnagenetics.com/product/hg23-aka-michael-jordan-fem/)
- `/assets/images/catalogue/hg23-aka-michael-jordan-fem-1.png`: https://dnagenetics.com/wp-content/uploads/2023/12/hg23-pic-300x276-min.png (product: https://dnagenetics.com/product/hg23-aka-michael-jordan-fem/)
- `/assets/images/catalogue/gmo-kosher-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/GMO_Kosher_DNA_Genetics-768x768-1.webp (product: https://dnagenetics.com/product/gmo-kosher/)
- `/assets/images/catalogue/snack-pack-0.webp`: https://dnagenetics.com/wp-content/uploads/2024/07/DNA_Genetics_Snack_Pack-768x768-1.webp (product: https://dnagenetics.com/product/snack-pack/)
- `/assets/images/catalogue/white-chocolope-0.webp`: https://dnagenetics.com/wp-content/uploads/2023/11/White_Chocolope_DNA_Genetics-1-768x768-min-1-1.webp (product: https://dnagenetics.com/product/white-chocolope/)
- `/assets/images/catalogue/white-chocolope-1.jpeg`: https://dnagenetics.com/wp-content/uploads/2023/11/DNA_Genetics_White_Chocolope.jpeg (product: https://dnagenetics.com/product/white-chocolope/)


## Autoflower product galleries

Individual product pages inspected on 2026-09-10. Source details and pack prices: `reference/autoflower-product-records.json`. Descriptions are adapted; local stock is zero.
- `/assets/images/catalogue/dna-auto-mystery-pack-cannabis-seeds-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/dna-genetics-seed-placeholder.webp (product: https://dnagenetics.com/product/dna-auto-mystery-pack-cannabis-seeds/)
- `/assets/images/catalogue/dna-auto-mystery-pack-cannabis-seeds-1.webp`: https://dnagenetics.com/wp-content/uploads/2024/12/dna-genetics-seed-placeholde-1-768x803-1.webp (product: https://dnagenetics.com/product/dna-auto-mystery-pack-cannabis-seeds/)
- `/assets/images/catalogue/kosher-dawg-autoflower-cannabis-seeds-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/DNA_Genetics_Kosher_Dawg-768x768-1.webp (product: https://dnagenetics.com/product/kosher-dawg-autoflower-cannabis-seeds/)
- `/assets/images/catalogue/skywalker-kush-auto-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/DNA_Genetics_Skywalker_Kush-768x768-1.webp (product: https://dnagenetics.com/product/skywalker-kush-auto/)
- `/assets/images/catalogue/skywalker-kush-auto-1.webp`: https://dnagenetics.com/wp-content/uploads/2024/07/DNA_Genetics_Skywalker_Kush-768x768-1.webp (product: https://dnagenetics.com/product/skywalker-kush-auto/)
- `/assets/images/catalogue/mac-n-me-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/Mac_n_Me_Auto_Flower_DNA_Genetics-768x768-1.webp (product: https://dnagenetics.com/product/mac-n-me/)
- `/assets/images/catalogue/purple-wreck-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/imgpsh_fullsize_anim-min-768x768-1.webp (product: https://dnagenetics.com/product/purple-wreck/)
- `/assets/images/catalogue/miss-dna-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/Miss-DNA-DNA-Genetics-768x768-1.webp (product: https://dnagenetics.com/product/miss-dna/)
- `/assets/images/catalogue/dna-cake-auto-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/DNA_Genetics_DNA_Cake-min-1-768x768-1.webp (product: https://dnagenetics.com/product/dna-cake-auto/)
- `/assets/images/catalogue/dna-cake-auto-1.png`: https://dnagenetics.com/wp-content/uploads/2024/02/Four-Prophets-by-DNA-Genetics-300x300@2x-1.png (product: https://dnagenetics.com/product/dna-cake-auto/)
- `/assets/images/catalogue/dna-cake-auto-2.jpeg`: https://dnagenetics.com/wp-content/uploads/2024/02/DNA_Genetics_Challah_Bread-768x768-1.jpeg (product: https://dnagenetics.com/product/dna-cake-auto/)
- `/assets/images/catalogue/macmelon-auto-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/MacMelon_Auto_Flower_DNA_Genetics-1-768x768-1.webp (product: https://dnagenetics.com/product/macmelon-auto/)
- `/assets/images/catalogue/chemacal-romance-auto-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/CheMACal_Romance_Auto_Flower_DNA_Genetics-768x768-1.webp (product: https://dnagenetics.com/product/chemacal-romance-auto/)
- `/assets/images/catalogue/return-of-the-mac-auto-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/Return_of_the_Mac_Auto_Flower_DNA_Genetics-1-768x768-1.webp (product: https://dnagenetics.com/product/return-of-the-mac-auto/)
- `/assets/images/catalogue/patrick-swayze-auto-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/dna-genetics-seed-placeholder.webp (product: https://dnagenetics.com/product/patrick-swayze-auto/)
- `/assets/images/catalogue/the-big-mac-auto-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/The_Big_Mac_DNA_Genetics-1-768x768-1.webp (product: https://dnagenetics.com/product/the-big-mac-auto/)
- `/assets/images/catalogue/macnana-auto-seeds-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/MacNana_Auto_Flower_DNA_Genetics-1-768x768-1.webp (product: https://dnagenetics.com/product/macnana-auto-seeds/)
- `/assets/images/catalogue/canelo-auto-seeds-0.webp`: https://dnagenetics.com/wp-content/uploads/2023/11/Canelo_Auto_Flower_DNA_Genetics-1-768x768-2.webp (product: https://dnagenetics.com/product/canelo-auto-seeds/)
- `/assets/images/catalogue/canelo-auto-seeds-1.png`: https://dnagenetics.com/wp-content/uploads/2023/11/3peat-tree-1-1.png (product: https://dnagenetics.com/product/canelo-auto-seeds/)
- `/assets/images/catalogue/canelo-auto-seeds-2.png`: https://dnagenetics.com/wp-content/uploads/2023/11/Four-Prophets-by-DNA-Genetics-300x300@2x-2.png (product: https://dnagenetics.com/product/canelo-auto-seeds/)
- `/assets/images/catalogue/canelo-auto-seeds-3.png`: https://dnagenetics.com/wp-content/uploads/2023/11/Four-Prophets-by-DNA-Genetics-300x300-1-1.png (product: https://dnagenetics.com/product/canelo-auto-seeds/)
- `/assets/images/catalogue/watermelon-man-auto-seeds-0.webp`: https://dnagenetics.com/wp-content/uploads/2023/11/Watermelon_Man_Auto_Flower_DNA_Genetics-1-768x768-1.webp (product: https://dnagenetics.com/product/watermelon-man-auto-seeds/)
- `/assets/images/catalogue/purple-people-eater-auto-seeds-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/Purple_People_Eater_Auto_Flower_DNA_Genetics-1-768x768-1.webp (product: https://dnagenetics.com/product/purple-people-eater-auto-seeds/)
- `/assets/images/catalogue/hg23-aka-michael-jordan-auto-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/HG23_Michael_Jordan_Auto_Flower_DNA_Genetics-1-768x768-1.webp (product: https://dnagenetics.com/product/hg23-aka-michael-jordan-auto/)
- `/assets/images/catalogue/hg23-aka-michael-jordan-auto-1.png`: https://dnagenetics.com/wp-content/uploads/2023/12/hg23-pic-300x276-min.png (product: https://dnagenetics.com/product/hg23-aka-michael-jordan-auto/)


## Regular Seeds product galleries

Individual product pages inspected on 2026-09-10. Source details and pack prices: `reference/regular-product-records.json`. Descriptions are adapted; local stock is zero.
- `/assets/images/catalogue/swiss-miss-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/Swiss_Miss_DNA_Genetics-600x600-1.webp (product: https://dnagenetics.com/product/swiss-miss/)
- `/assets/images/catalogue/dna-mystery-pack-0.webp`: https://dnagenetics.com/wp-content/uploads/2024/07/photo_2026-01-22_02-47-26.webp (product: https://dnagenetics.com/product/dna-mystery-pack/)
- `/assets/images/catalogue/dna-mystery-pack-1.webp`: https://dnagenetics.com/wp-content/uploads/2024/12/dna-genetics-seed-placeholde-1-768x803-1.webp (product: https://dnagenetics.com/product/dna-mystery-pack/)
- `/assets/images/catalogue/chocolate-truffle-shuffle-reg-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/CTS_DNA_Genetics-1-600x600-1.webp (product: https://dnagenetics.com/product/chocolate-truffle-shuffle-reg/)
- `/assets/images/catalogue/chocolate-truffle-shuffle-reg-1.webp`: https://dnagenetics.com/wp-content/uploads/2024/02/DNA_Genetics_C.T.S-768x768-1.webp (product: https://dnagenetics.com/product/chocolate-truffle-shuffle-reg/)
- `/assets/images/catalogue/you-whoo-reg-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/You_Whoo_DNA_Genetics-2-600x600-1.webp (product: https://dnagenetics.com/product/you-whoo-reg/)
- `/assets/images/catalogue/you-whoo-reg-1.jpeg`: https://dnagenetics.com/wp-content/uploads/2024/02/DNA_Genetics_You_Whoo.jpeg (product: https://dnagenetics.com/product/you-whoo-reg/)
- `/assets/images/catalogue/golden-fortunes-reg-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/Golden_Fortunes_S1_DNA_Genetics-1-600x600-1.webp (product: https://dnagenetics.com/product/golden-fortunes-reg/)
- `/assets/images/catalogue/generation-x-18-reg-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/Generation-X18_DNA_Genetics-1-600x600-1.webp (product: https://dnagenetics.com/product/generation-x-18-reg/)
- `/assets/images/catalogue/generation-x-18-reg-1.jpeg`: https://dnagenetics.com/wp-content/uploads/2023/11/DNA_Genetics_Generation_X18.jpeg (product: https://dnagenetics.com/product/generation-x-18-reg/)
- `/assets/images/catalogue/elons-x-reg-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/Elons-X_DNA_Genetics-1-600x600-1.webp (product: https://dnagenetics.com/product/elons-x-reg/)
- `/assets/images/catalogue/elons-x-reg-1.webp`: https://dnagenetics.com/wp-content/uploads/2023/12/Elons-X-Myalr.webp (product: https://dnagenetics.com/product/elons-x-reg/)
- `/assets/images/catalogue/24k-x-chocolope-kush-seeds-0.webp`: https://dnagenetics.com/wp-content/uploads/2023/11/Tangilope_DNA_Genetics-1.webp (product: https://dnagenetics.com/product/24k-x-chocolope-kush-seeds/)
- `/assets/images/catalogue/24k-x-chocolope-kush-seeds-1.jpg`: https://dnagenetics.com/wp-content/uploads/2023/11/DNA-Genetics-Seed-Placeholder-600x600-1.jpg (product: https://dnagenetics.com/product/24k-x-chocolope-kush-seeds/)
- `/assets/images/catalogue/kosher-kush-reg-0.webp`: https://dnagenetics.com/wp-content/uploads/2023/11/Kosher_Kush_Reg_DNA_Genetics-1-600x600-2.webp (product: https://dnagenetics.com/product/kosher-kush-reg/)
- `/assets/images/catalogue/chocolope-kush-reg-0.webp`: https://dnagenetics.com/wp-content/uploads/2023/11/DNA_Genetics_Chocolope_Kush.webp (product: https://dnagenetics.com/product/chocolope-kush-reg/)
- `/assets/images/catalogue/chocolope-256-reg-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/Chocolope_256_DNA_Genetics-1-600x600-1.webp (product: https://dnagenetics.com/product/chocolope-256-reg/)
- `/assets/images/catalogue/chocolope-256-reg-1.jpeg`: https://dnagenetics.com/wp-content/uploads/2023/11/DNA_Genetics_Chocolope_256.jpeg (product: https://dnagenetics.com/product/chocolope-256-reg/)
- `/assets/images/catalogue/tangie-reg-0.webp`: https://dnagenetics.com/wp-content/uploads/2023/11/DNA_Genetics_Tangie-1.webp (product: https://dnagenetics.com/product/tangie-reg/)
- `/assets/images/catalogue/four-prophets-reg-0.webp`: https://dnagenetics.com/wp-content/uploads/2025/10/DNA_Genetics_Four_Prophets-1-600x600-1.webp (product: https://dnagenetics.com/product/four-prophets-reg/)
- `/assets/images/catalogue/skylwalker-kush-reg-0.webp`: https://dnagenetics.com/wp-content/uploads/2023/11/DNA_Genetics_Skywalker_Kush-600x600-2.webp (product: https://dnagenetics.com/product/skylwalker-kush-reg/)


## THCA informational gallery

Public reference gallery inspected 2026-09-12. Images used in a non-transactional informational display.
- /assets/images/flower-information/flower-0.jpeg: https://dnagenetics.com/wp-content/uploads/2025/12/DNA-THCa-Rp43-300x300.jpeg
- /assets/images/flower-information/flower-1.jpeg: https://dnagenetics.com/wp-content/uploads/2025/12/DNA-THCa-Honey-beez-300x300.jpeg
- /assets/images/flower-information/flower-2.jpeg: https://dnagenetics.com/wp-content/uploads/2025/12/DNA-THCa-Guavanade-300x300.jpeg
- /assets/images/flower-information/flower-3.jpeg: https://dnagenetics.com/wp-content/uploads/2025/12/DNA-THCa-Gaz-Money-300x300.jpeg
- /assets/images/flower-information/flower-4.jpeg: https://dnagenetics.com/wp-content/uploads/2025/12/DNA-THCa-Choco-mintz-300x300.jpeg
