#!/usr/bin/env python3
"""
Update rwcb-dashboard-interactive.html with bento grid layout changes:
1. Replace toggle buttons with dropdown selects
2. Add hero card treatments
3. Add visual-first card structures
4. Reorder cards per bento design
5. Add section-start classes
"""

import re
from pathlib import Path

def create_dropdown(indicator_name, options):
    """Create dropdown select HTML from options"""
    dropdown = f'''<select class="view-dropdown" aria-label="View options for {indicator_name}">
'''
    for i, (value, label, icon) in enumerate(options):
        selected = ' selected' if i == 0 else ''
        dropdown += f'                                <option value="{value}"{selected}>{icon} {label}</option>\n'
    dropdown += '                            </select>'
    return dropdown

def replace_toggle_with_dropdown(card_html, indicator_name):
    """Replace viz-toggle-group with dropdown select"""
    # Extract options from toggle buttons
    pattern = r'<button class="viz-toggle.*?" data-option="([\w-]+)".*?<span class="toggle-icon">(.*?)</span><span class="toggle-label">(.*?)</span></button>'
    matches = re.findall(pattern, card_html)

    if not matches:
        return card_html

    options = [(value, label, icon) for value, icon, label in matches]
    dropdown = create_dropdown(indicator_name, options)

    # Replace entire viz-toggle-group with dropdown
    pattern = r'<div class="viz-toggle-group".*?</div>\s*</div>'
    replacement = dropdown + '\n                            </div>'

    return re.sub(pattern, replacement, card_html, flags=re.DOTALL)

def add_card_classes(card_html, classes):
    """Add indicator card modifier classes (hero, section-start, etc.)"""
    # Find the existing class attribute
    pattern = r'class="(tm-card indicator-card[^"]*)"'
    match = re.search(pattern, card_html)

    if not match:
        return card_html

    existing_classes = match.group(1)
    new_classes = existing_classes

    # Add each class if not already present
    for cls in classes:
        full_class = f'indicator-card--{cls}'
        if full_class not in new_classes:
            new_classes += f' {full_class}'

    return card_html.replace(
        f'class="{existing_classes}"',
        f'class="{new_classes}"',
        1  # Only replace first occurrence
    )

def add_visual_first_structure(card_html, image_url, image_alt):
    """Wrap card content with visual-first structure"""
    # Find where indicator-viz-container starts
    viz_container_match = re.search(r'(<div class="indicator-viz-container">)', card_html)
    if not viz_container_match:
        return card_html

    # Insert visual div before viz-container
    visual_html = f'''
                        <!-- Visual-First Image -->
                        <div class="card-visual">
                            <img src="{image_url}" alt="{image_alt}" loading="lazy">
                        </div>

                        <!-- Card Content -->
                        <div class="card-content">
'''

    # Add visual div
    card_html = card_html.replace(
        viz_container_match.group(1),
        visual_html + viz_container_match.group(1)
    )

    # Close card-content div before aside
    card_html = card_html.replace(
        '                        <aside class="indicator-context">',
        '                        </div>\n                        \n                        <aside class="indicator-context">'
    )

    return card_html

def extract_card(html, indicator_id):
    """Extract a single indicator card from HTML"""
    pattern = rf'(<article class="[^"]*indicator-card[^"]*" data-indicator="{indicator_id}">.*?</article>)'
    match = re.search(pattern, html, re.DOTALL)
    return match.group(1) if match else None

def main():
    html_file = Path('rwcb-dashboard-interactive.html')
    html_content = html_file.read_text()

    # Extract all indicator cards
    indicators = {
        'hectares-under-restoration': extract_card(html_content, 'hectares-under-restoration'),
        'seedlings': extract_card(html_content, 'seedlings'),
        'trees-planted': extract_card(html_content, 'trees-planted'),
        'survival-rate': extract_card(html_content, 'survival-rate'),
        'natural-regeneration': extract_card(html_content, 'natural-regeneration'),
        'species-diversity': extract_card(html_content, 'species-diversity'),
        'habitat-suitability': extract_card(html_content, 'habitat-suitability'),
        'hectares-restored': extract_card(html_content, 'hectares-restored'),
    }

    # Update each card
    updated_indicators = {}

    # 1. Hectares Under Restoration (Hero, Visual-First, Section-Start)
    card = indicators['hectares-under-restoration']
    card = add_card_classes(card, ['hero', 'section-start'])
    # Replace placeholder map with Africa basemap
    card = card.replace(
        'viewBox="0 0 400 300"',
        'viewBox="0 0 400 300" style="width: 100%; height: 400px;"'
    )
    # Note: Africa basemap SVG is in assets/images/africa-basemap.svg
    # For now, keep existing map but make it larger
    card = replace_toggle_with_dropdown(card, 'Hectares Under Restoration')
    updated_indicators['hectares-under-restoration'] = card

    # 2. Seedlings (Section-Start)
    card = indicators['seedlings']
    card = add_card_classes(card, ['section-start'])
    card = replace_toggle_with_dropdown(card, 'Seedlings Produced')
    updated_indicators['seedlings'] = card

    # 3. Trees Planted
    card = indicators['trees-planted']
    card = replace_toggle_with_dropdown(card, 'Trees Planted')
    updated_indicators['trees-planted'] = card

    # 4. Survival Rate (Section-Start)
    card = indicators['survival-rate']
    card = add_card_classes(card, ['section-start'])
    card = replace_toggle_with_dropdown(card, 'Tree Survival Rate')
    updated_indicators['survival-rate'] = card

    # 5. Natural Regeneration (Visual-First)
    card = indicators['natural-regeneration']
    card = add_visual_first_structure(
        card,
        'https://via.placeholder.com/800x400/8eca3f/ffffff?text=Natural+Regeneration+Photo',
        'Natural regeneration evidence'
    )
    card = replace_toggle_with_dropdown(card, 'Natural Regeneration')
    updated_indicators['natural-regeneration'] = card

    # 6. Species Diversity (Section-Start)
    card = indicators['species-diversity']
    card = add_card_classes(card, ['section-start'])
    card = replace_toggle_with_dropdown(card, 'Tree Species Diversity')
    updated_indicators['species-diversity'] = card

    # 7. Habitat Suitability (Visual-First)
    card = indicators['habitat-suitability']
    card = add_visual_first_structure(
        card,
        'https://via.placeholder.com/800x400/477010/ffffff?text=Chimpanzee+Habitat+Photo',
        'Chimpanzee habitat suitability'
    )
    card = replace_toggle_with_dropdown(card, 'Chimpanzee Habitat Suitability')
    updated_indicators['habitat-suitability'] = card

    # 8. Hectares Restored (Hero, Section-Start)
    card = indicators['hectares-restored']
    card = add_card_classes(card, ['hero', 'section-start'])
    card = replace_toggle_with_dropdown(card, 'Hectares Restored (Final Outcome)')
    updated_indicators['hectares-restored'] = card

    # Replace the entire indicators section with reordered cards
    # Find the dashboard-bento-grid div
    grid_start = html_content.find('<div class="dashboard-bento-grid">')
    # Find the closing div (look for the pattern that closes the grid container)
    grid_end = html_content.find('\n                </div>\n\n            </div>\n        </main>', grid_start)

    if grid_start == -1:
        print("Error: Could not find dashboard-bento-grid div")
        return

    if grid_end == -1:
        # Try alternate pattern
        grid_end = html_content.find('\n\n            </div>\n        </main>', grid_start)
        if grid_end == -1:
            print("Error: Could not find closing div")
            print(f"Grid starts at: {grid_start}")
            return

    # Build new indicators section in correct order
    new_indicators_html = '''
                <!-- =====================================
                     INDICATOR 1: HECTARES UNDER RESTORATION (HERO)
                     ===================================== -->
'''
    new_indicators_html += updated_indicators['hectares-under-restoration']

    new_indicators_html += '''

                <!-- =====================================
                     SECTION: PIPELINE METRICS
                     ===================================== -->

                <!-- =====================================
                     INDICATOR 2: SEEDLINGS PRODUCED
                     ===================================== -->
'''
    new_indicators_html += updated_indicators['seedlings']

    new_indicators_html += '''

                <!-- =====================================
                     INDICATOR 3: TREES PLANTED
                     ===================================== -->
'''
    new_indicators_html += updated_indicators['trees-planted']

    new_indicators_html += '''

                <!-- =====================================
                     SECTION: ECOLOGICAL OUTCOMES
                     ===================================== -->

                <!-- =====================================
                     INDICATOR 4: SURVIVAL RATE
                     ===================================== -->
'''
    new_indicators_html += updated_indicators['survival-rate']

    new_indicators_html += '''

                <!-- =====================================
                     INDICATOR 5: NATURAL REGENERATION
                     ===================================== -->
'''
    new_indicators_html += updated_indicators['natural-regeneration']

    new_indicators_html += '''

                <!-- =====================================
                     SECTION: BIODIVERSITY
                     ===================================== -->

                <!-- =====================================
                     INDICATOR 6: SPECIES DIVERSITY
                     ===================================== -->
'''
    new_indicators_html += updated_indicators['species-diversity']

    new_indicators_html += '''

                <!-- =====================================
                     INDICATOR 7: CHIMPANZEE HABITAT SUITABILITY
                     ===================================== -->
'''
    new_indicators_html += updated_indicators['habitat-suitability']

    new_indicators_html += '''

                <!-- =====================================
                     SECTION: FINAL OUTCOME
                     ===================================== -->

                <!-- =====================================
                     INDICATOR 8: HECTARES RESTORED (HERO)
                     ===================================== -->
'''
    new_indicators_html += updated_indicators['hectares-restored']

    new_indicators_html += '\n            '

    # Replace old content with new
    new_html = (
        html_content[:grid_start + len('<div class="dashboard-bento-grid">')] +
        new_indicators_html +
        html_content[grid_end:]
    )

    # Write updated HTML
    output_file = Path('rwcb-dashboard-interactive-bento.html')
    output_file.write_text(new_html)
    print(f"✅ Updated HTML written to: {output_file}")
    print(f"   Original: {len(html_content)} chars")
    print(f"   Updated:  {len(new_html)} chars")
    print(f"   Diff:     {len(new_html) - len(html_content):+} chars")

if __name__ == '__main__':
    main()
