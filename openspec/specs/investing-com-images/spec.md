# investing-com-images Specification

## Purpose

Ensures the Investing.com news feed's thumbnail image is recognized and shown on its news cards, despite that feed mislabeling the image's declared type.

## Requirements

### Requirement: Investing.com enclosure image recognition
The system SHALL treat an Investing.com news item's RSS enclosure as its image when the enclosure's URL has a recognized image file extension (`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, or `.avif`), even if the enclosure's declared type is not an `image/*` MIME type.

#### Scenario: Enclosure image URL with a mislabeled type
- **WHEN** an Investing.com news item's RSS enclosure has a URL ending in a recognized image file extension, but its declared type is not an `image/*` MIME type
- **THEN** the system uses that enclosure's URL as the news item's image

#### Scenario: Enclosure that is genuinely not an image
- **WHEN** an Investing.com news item's RSS enclosure has a URL that does not end in a recognized image file extension, regardless of its declared type
- **THEN** the system does not use that enclosure as the news item's image, and falls back to any other image source available for that item, or no image if none is available
