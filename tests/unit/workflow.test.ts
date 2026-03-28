import { describe, it, expect } from 'vitest';
import { getAvailableTransitions } from '../../src/lib/server/workflow/index.js';

const states = {
	draft: {
		transitions: [{ to: 'pending_review', label: 'Submit for Review' }]
	},
	pending_review: {
		transitions: [
			{ to: 'approved', label: 'Approve' },
			{ to: 'rejected', label: 'Reject' },
			{ to: 'draft', label: 'Return to Draft' }
		]
	},
	approved: {
		transitions: [{ to: 'draft', label: 'Reopen' }]
	},
	rejected: {
		transitions: [{ to: 'draft', label: 'Reopen' }]
	}
};

describe('getAvailableTransitions', () => {
	it('returns transitions for draft state', () => {
		const transitions = getAvailableTransitions(states, 'draft');
		expect(transitions).toHaveLength(1);
		expect(transitions[0].to).toBe('pending_review');
		expect(transitions[0].label).toBe('Submit for Review');
	});

	it('returns transitions for pending_review state', () => {
		const transitions = getAvailableTransitions(states, 'pending_review');
		expect(transitions).toHaveLength(3);
		expect(transitions.map((t) => t.to)).toEqual(['approved', 'rejected', 'draft']);
	});

	it('returns single transition for approved state', () => {
		const transitions = getAvailableTransitions(states, 'approved');
		expect(transitions).toHaveLength(1);
		expect(transitions[0].to).toBe('draft');
	});

	it('returns empty array for unknown state', () => {
		const transitions = getAvailableTransitions(states, 'nonexistent');
		expect(transitions).toHaveLength(0);
	});
});
