# MJ Prompt Manager Requirements

## Core Features
- Create a UI interface
- Support multiple prompt input methods
- Implement advanced prompt substitution
- Process and submit prompts to MJ API

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
curl 'https://www.kojima.com/api/app/submit-jobs' \
  -H 'accept: */*' \
  -H 'content-type: application/json' \
  -H 'origin: https://www.kojima.com' \
  -H 'referer: https://www.kojima.com/explore' \
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
