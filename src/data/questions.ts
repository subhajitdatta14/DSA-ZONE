import { Question } from '../types/dsa';
import { LINEAR_DS_QUESTIONS } from './questions/linearDataStructures';
import { QUEUE_HASH_QUESTIONS } from './questions/queueAndHashStructures';
import { TREE_QUESTIONS } from './questions/treeStructures';
import { GRAPH_QUESTIONS } from './questions/graphStructures';
import { SEARCH_ALGO_QUESTIONS } from './questions/searchAndAlgorithmStructures';

const RAW_QUESTIONS: Question[] = [
  ...LINEAR_DS_QUESTIONS,
  ...QUEUE_HASH_QUESTIONS,
  ...TREE_QUESTIONS,
  ...GRAPH_QUESTIONS,
  ...SEARCH_ALGO_QUESTIONS,
];

// Balanced distribution pattern ensuring a healthy, realistic mix of A, B, C, D across questions
const TARGET_SLOT_PATTERN = ['b', 'c', 'a', 'd', 'd', 'a', 'c', 'b', 'a', 'd', 'b', 'c'];

function balanceQuestionOptions(questions: Question[]): Question[] {
  const topicCounts: Record<string, number> = {};

  return questions.map((q) => {
    if (!q.options || q.options.length !== 4) return q;

    const topic = q.topicId || 'general';
    const topicIdx = topicCounts[topic] || 0;
    topicCounts[topic] = topicIdx + 1;

    const targetId = TARGET_SLOT_PATTERN[topicIdx % TARGET_SLOT_PATTERN.length];
    const targetIdx = ['a', 'b', 'c', 'd'].indexOf(targetId);

    const correctOpt = q.options.find((o) => o.id === q.correctOptionId) || q.options[0];
    const wrongOpts = q.options.filter((o) => o !== correctOpt);

    const slotIds = ['a', 'b', 'c', 'd'];
    const newOptions: { id: string; text: string }[] = [];
    let wrongIdx = 0;

    for (let i = 0; i < 4; i++) {
      if (i === targetIdx) {
        newOptions.push({
          id: slotIds[i],
          text: correctOpt.text,
        });
      } else {
        newOptions.push({
          id: slotIds[i],
          text: wrongOpts[wrongIdx++].text,
        });
      }
    }

    return {
      ...q,
      options: newOptions,
      correctOptionId: targetId,
    };
  });
}

export const QUESTIONS: Question[] = balanceQuestionOptions(RAW_QUESTIONS);

