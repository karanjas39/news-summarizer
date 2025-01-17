# News Summarizer

**News Summarizer** is a lightweight, TypeScript-based library for summarizing news articles. It processes long-form content into concise summaries by analyzing sentence structure, key metrics, and contextual relevance.

## Features

- Extracts meaningful sentences from lengthy text.
- Scores sentences based on content patterns and metrics.
- Optimized for news articles with support for financial, analytical, and action-related text patterns.
- Easy-to-use API with customizable summary lengths.

## Installation

Install the library via npm:

```bash
npm install news-summarizer
```

## Usage

Import and use the `NewsSummarizer` class in your TypeScript or JavaScript project:

```typescript
import { NewsSummarizer } from "news-summarizer";

const summarizer = new NewsSummarizer();
const text = `
  Apple Inc. announced its latest financial results today, reporting a 15% increase in quarterly revenue
  to $120 billion, driven by strong iPhone sales. The company also projected significant growth for the
  next quarter as it plans to launch new products and expand its market reach.
`;

const summary = summarizer.summarize(text, 3); // Summarize to 3 sentences
console.log(summary);
```

### Example Output

```
Apple Inc. announced its latest financial results today, reporting a 15% increase in quarterly revenue to $120 billion, driven by strong iPhone sales. The company also projected significant growth for the next quarter as it plans to launch new products and expand its market reach.
```

## Methods

### `summarize(text: string, numSentences: number = 3): string`

Generates a summary for the given text.

- **Parameters**:
  - `text` (string): The input text to summarize.
  - `numSentences` (number, optional): The number of sentences to include in the summary (default: 3).
- **Returns**:
  - A string containing the summarized content.

### Example

```typescript
const text = "Your article or content here...";
const summary = summarizer.summarize(text, 5); // Summarize to 5 sentences
console.log(summary);
```

## Development

### Local Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/news-summarizer.git
cd news-summarizer
npm install
```

Build the project:

```bash
npm run build
```

Run tests (if applicable):

```bash
npm test
```

## Contribution

Contributions are welcome! Feel free to fork the repository and submit pull requests.

## Contact

- **Email**: [yourname@example.com](mailto:yourname@example.com)
- **LinkedIn**: [Jaskaran Singh](https://www.linkedin.com/in/singhjaskaran)

---

### License

This project is licensed under the MIT License.
