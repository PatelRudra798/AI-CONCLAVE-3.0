# TODO

## Done
- Updated `REG_TIERS` in `src/data/index.js` to required 3 tiers:
  - IEEE Member: ₹150
  - Non-IEEE Member: ₹200
  - Professional: ₹350
- Updated `src/components/IdCardGenerator.jsx`:
  - Added tier selector UI (3 options) with selected tier reflected on badge.
  - Added aligned “red box” tier section on the badge showing tier name + price.
  - Updated download filename to include tier + price.

## Next (recommended)
- Visually confirm in the browser that the “Register Now” tier cards are correctly aligned in the UI.
- If “Register Now” cards still look misaligned, adjust `src/components/RegistrationSection.jsx` layout/styles (grid/gaps/card padding) to make placements proper across breakpoints.
- Re-check `npm run dev` + download PNG for each tier.

