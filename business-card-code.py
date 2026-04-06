import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.offsetbox import OffsetImage, AnnotationBbox
import numpy as np

# Create figure and axes
fig, ax = plt.subplots(figsize=(10, 6))
fig.patch.set_facecolor('#121212') # Dark background
ax.set_facecolor('#121212')

# --- Background Circuit Lines (Simulated style) ---
# Adding some subtle lines to mimic the original aesthetic without cluttering
lines = [
    ([0, 3], [5, 5]), ([3, 4], [5, 4]), ([4, 6], [4, 4]), # Top Left path
    ([8, 10], [1, 1]), ([7, 8], [1, 1]), ([7, 7], [1, 2]), # Bottom Right path
    ([2, 8], [3, 3]), # Middle horizontal
]
for x, y in lines:
    ax.plot(x, y, color='#8B2E2E', linewidth=1, alpha=0.5)
    
# --- CONTENT PLACEMENT ---

# 1. LOGO (Top Left Anchor)
# Simulating the Triangle Logo
triangle = patches.Polygon([[1, 4.8], [1.5, 5.6], [2, 4.8]], closed=True, fill=False, edgecolor='white', linewidth=2)
inner_tri = patches.Polygon([[1.25, 4.9], [1.5, 5.3], [1.75, 4.9]], closed=True, fill=False, edgecolor='#C0392B', linewidth=2)
ax.add_patch(triangle)
ax.add_patch(inner_tri)

# Logo Text
ax.text(2.2, 5.3, "ALTARED\nALCHEMIE", color='white', fontsize=20, weight='bold', va='center', fontname='DejaVu Sans')
ax.text(2.2, 4.9, "A I  S E R V I C E S", color='grey', fontsize=8, weight='normal', va='center')


# 2. CONTACT INFO (Top Right Anchor)
# Right-aligned for balance against the logo
ax.text(9.5, 5.3, "Jimmie Miller", color='white', fontsize=18, weight='bold', ha='right')
ax.text(9.5, 4.9, "314-723-2649", color='white', fontsize=16, ha='right')
ax.text(9.5, 4.5, "jimmie@altaredalchemie.com", color='white', fontsize=14, ha='right')


# 3. SERVICES (Bottom Left Anchor)
# Aligned with the Logo above it
ax.text(1, 1.8, "AI INTEGRATION SERVICES", color='white', fontsize=18, weight='bold')
ax.text(1, 1.4, "AI AUTOMATIONS  |  WEBSITES  |  AI CONSULTING", color='#CCCCCC', fontsize=10)


# 4. QR CODE (Bottom Right Anchor)
# Placed opposite the services, creating a clean corner
# Creating a mock QR code square
qr_bg = patches.Rectangle((8.3, 0.8), 1.2, 1.2, fill=True, facecolor='white')
ax.add_patch(qr_bg)
# Mock pattern inside
import random
for i in range(5):
    for j in range(5):
        if random.choice([True, False]):
            rect = patches.Rectangle((8.35 + i*0.2, 0.85 + j*0.2), 0.15, 0.15, fill=True, facecolor='black')
            ax.add_patch(rect)
            
# Mock red border for QR (from original)
qr_border = patches.Rectangle((8.25, 0.75), 1.3, 1.3, fill=False, edgecolor='#C0392B', linewidth=2)
ax.add_patch(qr_border)


# --- SETTINGS ---
ax.set_xlim(0, 10)
ax.set_ylim(0, 6)
ax.axis('off') # Hide axes

plt.tight_layout()
plt.savefig('C:/Users/jlmil/OneDrive/Desktop/business_card.png', bbox_inches='tight', dpi=300)
plt.show()