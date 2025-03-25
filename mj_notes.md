# Midjourney Prompt Manager Requirements

## Core Features
- Create a UI interface
- Support multiple prompt input methods
- Implement advanced prompt substitution
- Process and submit prompts to Midjourney API

### Advanced Prompt Substitution Example
Input format: `"a prompt of [word1,word2,word3]..."`  
Generates multiple prompts:
```
a prompt of word1...
a prompt of word2...
a prompt of word3...
```

## API Integration
### Submit Request Example
Token authentication required via UI input.

```bash
curl 'https://www.midjourney.com/api/app/submit-jobs' \
  -H 'accept: */*' \
  -H 'content-type: application/json' \
  -H 'origin: https://www.midjourney.com' \
  -H 'referer: https://www.midjourney.com/explore' \
  -H 'x-csrf-protection: 1' \
  --data-raw '{
    "f": {
      "mode": "relaxed",
      "private": false
    },
    "channelId": "singleplayer_96da26f7-3a77-43a4-a725-7b141a4aedba",
    "roomId": null,
    "metadata": {
      "isMobile": null,
      "imagePrompts": 0,
      "imageReferences": 0,
      "characterReferences": 0,
      "depthReferences": 0,
      "lightboxOpen": null
    },
    "t": "imagine",
    "prompt": "test --chaos 20 --stylize 600 --v 6.1"
  }'
```

## Validation Prompts
Collection of test prompts for validating Midjourney's capabilities:

### Scene Prompts
- A futuristic cityscape with towering skyscrapers and flying cars
- A medieval tavern with a fireplace, wooden tables, and people talking
- A dense forest with tall trees, moss-covered rocks, and a river
- An airship floating in the sky above a vast mountain range
- A ruined city with abandoned buildings and overgrown vegetation

### Character Prompts
- A warrior in armor holding a sword and standing on a battlefield
- A person wearing a high-tech suit with glowing elements
- A woman sitting in a café, looking out the window at the street
- A wizard casting a spell with sparks of energy around their hands
- A humanoid robot standing in a laboratory surrounded by monitors
- A lone figure standing on a cliff, looking at the horizon

### Environment Prompts
- A study room with bookshelves, a desk, and scattered papers
- A narrow alleyway with a single streetlamp casting shadows
- A lighthouse standing on a rocky shore with waves crashing
- A car driving on a highway with a city skyline in the distance
- A large castle with towers and a drawbridge over a moat
- A dragon flying over a valley with a river below
- A battlefield with soldiers clashing and banners waving
- A small village with cobblestone streets and wooden houses
- A marketplace filled with people, stalls, and goods

### Detail Prompts
- A table with a chessboard in the middle of a game
- A clock tower with gears visible inside the structure
- A plate of assorted food arranged on a wooden table
- An astronaut floating in space near a satellite
- A butterfly resting on a flower in a field

### Everyday Object Prompts
- A vintage alarm clock on a bedside table with morning light streaming through curtains
- A steaming cup of coffee on a wooden table next to an open book
- A well-worn leather wallet with cards and receipts peeking out
- A pair of glasses resting on an open newspaper
- A houseplant in a decorative pot with new leaves unfurling
- A wooden kitchen spoon resting on a ceramic spoon rest
- A smartphone charging on a nightstand with notification lights glowing
- A set of keys on a colorful keychain hanging from a hook
- A refrigerator door covered with family photos and children's artwork
- A stack of clean folded laundry on the edge of a bed
- A toothbrush and toothpaste tube beside a bathroom sink
- A dog's leash hanging from a hook by the front door
- A worn baseball cap on a coat rack in the entryway
- A cast iron pan with herbs and oil being heated on a stove
- A bicycle leaning against a wall in a garage
- A remote control on the arm of a comfortable sofa
- A desk lamp illuminating a workspace with scattered papers
- A mechanical wristwatch with its intricate gears visible
- A pair of well-worn running shoes by the door
- A half-eaten apple resting next to a laptop keyboard
- A clothes iron on an ironing board with a shirt partially pressed
- A collection of spice jars with handwritten labels in a kitchen rack
- A mailbox with envelopes and magazines sticking out
- A bathroom sink with toothbrushes, soap, and everyday items arranged neatly
- A window with raindrops running down the glass on a gray day
- A backpack hanging on a chair with books and notebooks peeking out
- A ceiling fan with dust collecting on the blades spinning slowly
- A kitchen counter with bread crumbs and a butter knife on a cutting board
- A porcelain teapot with steam rising from its spout on a lace doily
- A hand towel hanging slightly crooked on a bathroom towel ring
- A screwdriver set arranged by size in a toolbox compartment
- A hair brush with strands of hair caught in the bristles on a vanity
- A basket of fresh laundry waiting to be folded on a couch
- A water bottle with condensation forming on its surface on a desk
- A medicine cabinet with various pill bottles and health products
- A pencil holder filled with pens, pencils, and markers on a desk
- A light switch with fingerprint smudges around the plate
- A shopping list held by a magnet on a refrigerator door
- A kitchen sponge sitting in a small dish by the sink
- A comb with several teeth missing on a bathroom counter
- A power strip with multiple devices plugged in underneath a desk
- A jar of peanut butter with a knife sticking out of it
- A simple digital watch with the alarm time visible on the display
- A set of measuring cups hanging from hooks in a kitchen
- A computer mouse with a fraying cord on a mousepad
- A fly swatter hanging from a hook in a utility room
- A roll of paper towels on a kitchen counter next to a sink
- A welcome mat with muddy footprints at the front door
- A calendar hanging on a wall with important dates circled
- A dustpan and brush leaning against a wall in a corner

### Landscape Prompts
- A majestic mountain range at sunset with golden light casting long shadows across snow-capped peaks
- A serene misty valley with a winding river and ancient trees draped in morning fog
- A dramatic coastline with waves crashing against rugged cliffs and a lighthouse in the distance
- A lush tropical rainforest with a hidden waterfall and exotic flowers in vibrant colors
- A vast desert landscape with intricate sand dunes sculpted by the wind at golden hour
- An enchanted forest with bioluminescent plants and mystical light filtering through ancient trees
- A terraced rice field in Asia during harvest season with workers in traditional conical hats
- A dramatic volcanic landscape with flowing lava and steam rising against a twilight sky
- A peaceful lavender field stretching to the horizon with an old stone farmhouse in Provence
- A grand canyon with layered rock formations revealed by millions of years of erosion
- An Arctic landscape with massive blue icebergs floating in pristine waters under the northern lights
- An autumn forest with a carpet of fallen leaves in red, orange, and gold beside a reflective lake
- A Scottish highland vista with rolling hills covered in heather and an ancient castle ruin
- A Japanese garden in fall with maple trees, carefully arranged stones, and a traditional bridge
- A Tuscan countryside with gently rolling hills, cypress trees, and a rustic villa at sunset
- A prairie landscape with tall grasses swaying in the wind under a dramatic stormy sky
- An aerial view of the Amazon rainforest with a winding river cutting through endless green canopy
- A salt flat landscape during rainy season creating a perfect mirror reflection of the sky
- A bamboo forest with tall stalks creating natural corridors of dappled light and shadow
- An underwater landscape with a vibrant coral reef and schools of colorful tropical fish
