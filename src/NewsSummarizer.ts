interface SentenceInfo {
  text: string;
  paragraphIndex: number;
}

interface ScoredSentence extends SentenceInfo {
  score: number;
  index: number;
}

interface ContentPatterns {
  numbers: RegExp;
  comparison: RegExp;
  future: RegExp;
  significance: RegExp;
  analysis: RegExp;
  action: RegExp;
  impact: RegExp;
  stakeholder: RegExp;
}

export class NewsSummarizer {
  private static readonly MIN_SENTENCE_LENGTH = 30;
  private static readonly MAX_SENTENCE_LENGTH = 250;
  private static readonly POSITION_WEIGHT_FACTOR = 0.15;

  private readonly contentPatterns: ContentPatterns = {
    numbers: /\$?\d+(\.\d+)?(%|billion|million|thousand)?/g,
    comparison:
      /increase|decrease|grew|growth|higher|lower|rise|fell|drop|surge/i,
    future: /will|expect|forecast|project|predict|anticipate|plan|target|goal/i,
    significance:
      /significant|major|critical|important|essential|key|crucial|vital/i,
    analysis: /however|therefore|consequently|due to|because|despite|although/i,
    action:
      /launch|implement|introduce|announce|establish|develop|create|begin/i,
    impact: /affect|impact|influence|result|lead|cause|enable|improve/i,
    stakeholder:
      /company|government|organization|industry|sector|market|customer|user/i,
  };

  private isTitle(line: string): boolean {
    const words = line.trim().split(/\s+/);

    return (
      line.length < 150 &&
      (line.endsWith("Report") ||
        line.endsWith("Update") ||
        line.endsWith("News") ||
        line.endsWith("Analysis") ||
        line.toUpperCase() === line ||
        !line.endsWith(".") ||
        words.length < 8 ||
        words.every((word) => word.charAt(0) === word.charAt(0).toUpperCase()))
    );
  }

  private splitIntoSentences(text: string): SentenceInfo[] {
    // Handle common abbreviations to avoid false sentence splits
    const preparedText = text
      .replace(/([A-Z])\./g, "$1_DOT_")
      .replace(/(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|vs|etc)\./gi, "$1_DOT_")
      .replace(/([A-Z])[.]/g, "$1_DOT_");

    // Split into paragraphs first to maintain structural information
    const paragraphs = preparedText.split(/\n\s*\n/);

    const sentences: SentenceInfo[] = [];
    paragraphs.forEach((paragraph, paragraphIndex) => {
      const paragraphSentences = paragraph
        .replace(/([.!?])\s+(?=[A-Z])/g, "$1|")
        .split("|")
        .map((s) => s.replace(/_DOT_/g, ".").trim())
        .filter(
          (s) =>
            s.length >= NewsSummarizer.MIN_SENTENCE_LENGTH &&
            s.length <= NewsSummarizer.MAX_SENTENCE_LENGTH &&
            !this.isTitle(s) &&
            s.includes(" ")
        );

      sentences.push(
        ...paragraphSentences.map((sentence) => ({
          text: sentence,
          paragraphIndex,
        }))
      );
    });

    return sentences;
  }

  private calculateSentenceScore(
    sentence: string,
    index: number,
    totalSentences: number,
    paragraphIndex: number
  ): number {
    let score = 0;
    const text = sentence.toLowerCase();

    // Heavily penalize list items and technical specifications
    if (sentence.trim().startsWith("-") || sentence.trim().startsWith("•")) {
      score -= 5;
    }

    // Boost sentences with multiple high-value metrics
    const metrics =
      text.match(/\$?\d+(\.\d+)?(%|billion|million|thousand)?/g) || [];
    const uniqueMetricTypes = new Set(
      metrics.map((m) => {
        if (m.includes("$")) return "financial";
        if (m.includes("%")) return "percentage";
        if (m.includes("billion") || m.includes("million")) return "scale";
        return "other";
      })
    );
    score += uniqueMetricTypes.size * 2;

    // Boost sentences that connect multiple concepts
    const conceptLinks =
      text.match(/\b(while|however|despite|although|but|therefore)\b/gi) || [];
    score += conceptLinks.length * 1.5;

    // Position scoring
    const positionScore =
      1 - (index / totalSentences) * NewsSummarizer.POSITION_WEIGHT_FACTOR;
    score += positionScore;

    // First sentence of each paragraph gets a boost
    if (index === 0 || paragraphIndex > 0) {
      score += 0.5;
    }

    // Content pattern scoring
    Object.entries(this.contentPatterns).forEach(([pattern, regex]) => {
      const matches = (text.match(regex) || []).length;
      switch (pattern) {
        case "numbers":
          score += matches * 1.5;
          break;
        case "comparison":
        case "future":
          score += matches * 1.2;
          break;
        case "significance":
        case "impact":
          score += matches * 1.0;
          break;
        case "analysis":
          score += matches * 0.8;
          break;
        default:
          score += matches * 0.5;
      }
    });

    // Readability and length scoring
    const words = text.split(/\s+/).length;
    if (words < 10) score -= 1;
    if (words > 40) score -= (words - 40) * 0.05;

    // Penalize very similar sentences
    if (this.hasDuplicateInformation(text)) {
      score *= 0.7;
    }

    if (text.match(/\b(regulation|policy|law|directive|resolution)\b/i)) {
      score += 2;
    }

    // Boost sentences with clear impact statements
    if (text.match(/\b(impact|effect|result|outcome|consequence)\b/i)) {
      score += 1.5;
    }

    return score;
  }

  private hasDuplicateInformation(text: string): boolean {
    const phrases = text.toLowerCase().match(/\b\w+\s+\w+\s+\w+\b/g) || [];
    const uniquePhrases = new Set(phrases);
    return phrases.length - uniquePhrases.size > 2;
  }

  summarize(text: string, numSentences: number = 3): string {
    try {
      const sentences = this.splitIntoSentences(text);

      if (sentences.length <= numSentences) {
        return sentences.map((s) => s.text).join(" ");
      }

      // Score sentences with additional context
      const scoredSentences: ScoredSentence[] = sentences.map(
        (sent, index) => ({
          ...sent,
          score: this.calculateSentenceScore(
            sent.text,
            index,
            sentences.length,
            sent.paragraphIndex
          ),
          index,
        })
      );

      // Select top sentences while maintaining coherence
      const selectedSentences: ScoredSentence[] = [];
      const topScoringCount = Math.min(numSentences * 2, sentences.length);
      const topSentences = [...scoredSentences]
        .sort((a, b) => b.score - a.score)
        .slice(0, topScoringCount);

      // First, always include the highest scoring sentence
      selectedSentences.push(topSentences[0]);

      // Then select remaining sentences considering both score and context
      while (
        selectedSentences.length < numSentences &&
        topSentences.length > 0
      ) {
        const lastSelected = selectedSentences[selectedSentences.length - 1];

        let bestNextIndex = 1;
        let bestNextScore = -1;

        for (let i = 1; i < topSentences.length; i++) {
          const candidate = topSentences[i];
          let contextScore = candidate.score;

          // Boost score if from same or adjacent paragraph
          if (
            Math.abs(candidate.paragraphIndex - lastSelected.paragraphIndex) <=
            1
          ) {
            contextScore *= 1.2;
          }

          // Boost score if it's sequential
          if (Math.abs(candidate.index - lastSelected.index) === 1) {
            contextScore *= 1.1;
          }

          if (contextScore > bestNextScore) {
            bestNextScore = contextScore;
            bestNextIndex = i;
          }
        }

        selectedSentences.push(topSentences[bestNextIndex]);
        topSentences.splice(bestNextIndex, 1);
      }

      // Return sentences in original order
      return selectedSentences
        .sort((a, b) => a.index - b.index)
        .map((s) => s.text)
        .join(" ");
    } catch (error) {
      console.error("Summarization error:", error);
      throw new Error("Failed to generate summary");
    }
  }
}
