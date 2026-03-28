import { describe, it, expect } from 'vitest';
import { getAvailableTransitions } from '../../src/lib/server/workflow/index.js';

const approvalStates = {
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

describe('workflow transition validation', () => {
	it('cannot transition from draft directly to approved', () => {
		const transitions = getAvailableTransitions(approvalStates, 'draft');
		const canApprove = transitions.some((t) => t.to === 'approved');
		expect(canApprove).toBe(false);
	});

	it('cannot transition from draft directly to rejected', () => {
		const transitions = getAvailableTransitions(approvalStates, 'draft');
		const canReject = transitions.some((t) => t.to === 'rejected');
		expect(canReject).toBe(false);
	});

	it('can transition from pending_review to approved', () => {
		const transitions = getAvailableTransitions(approvalStates, 'pending_review');
		const canApprove = transitions.some((t) => t.to === 'approved');
		expect(canApprove).toBe(true);
	});

	it('can reopen from rejected back to draft', () => {
		const transitions = getAvailableTransitions(approvalStates, 'rejected');
		const canReopen = transitions.some((t) => t.to === 'draft');
		expect(canReopen).toBe(true);
	});

	it('can reopen from approved back to draft', () => {
		const transitions = getAvailableTransitions(approvalStates, 'approved');
		const canReopen = transitions.some((t) => t.to === 'draft');
		expect(canReopen).toBe(true);
	});
});

describe('workflow full cycle', () => {
	it('follows draft -> pending_review -> approved -> draft cycle', () => {
		let currentState = 'draft';

		// Step 1: submit for review
		let transitions = getAvailableTransitions(approvalStates, currentState);
		expect(transitions.some((t) => t.to === 'pending_review')).toBe(true);
		currentState = 'pending_review';

		// Step 2: approve
		transitions = getAvailableTransitions(approvalStates, currentState);
		expect(transitions.some((t) => t.to === 'approved')).toBe(true);
		currentState = 'approved';

		// Step 3: reopen
		transitions = getAvailableTransitions(approvalStates, currentState);
		expect(transitions.some((t) => t.to === 'draft')).toBe(true);
		currentState = 'draft';

		expect(currentState).toBe('draft');
	});

	it('follows draft -> pending_review -> rejected -> draft cycle', () => {
		let currentState = 'draft';

		let transitions = getAvailableTransitions(approvalStates, currentState);
		expect(transitions.some((t) => t.to === 'pending_review')).toBe(true);
		currentState = 'pending_review';

		transitions = getAvailableTransitions(approvalStates, currentState);
		expect(transitions.some((t) => t.to === 'rejected')).toBe(true);
		currentState = 'rejected';

		transitions = getAvailableTransitions(approvalStates, currentState);
		expect(transitions.some((t) => t.to === 'draft')).toBe(true);
		currentState = 'draft';

		expect(currentState).toBe('draft');
	});
});

describe('workflow edge cases', () => {
	it('returns empty for terminal state with no transitions', () => {
		const statesWithTerminal = {
			open: { transitions: [{ to: 'closed', label: 'Close' }] },
			closed: { transitions: [] }
		};
		const transitions = getAvailableTransitions(statesWithTerminal, 'closed');
		expect(transitions).toHaveLength(0);
	});

	it('handles single-state workflow', () => {
		const single = {
			only: { transitions: [] }
		};
		const transitions = getAvailableTransitions(single, 'only');
		expect(transitions).toHaveLength(0);
	});

	it('handles state with self-transition', () => {
		const selfLoop = {
			processing: {
				transitions: [
					{ to: 'processing', label: 'Retry' },
					{ to: 'done', label: 'Complete' }
				]
			},
			done: { transitions: [] }
		};
		const transitions = getAvailableTransitions(selfLoop, 'processing');
		expect(transitions).toHaveLength(2);
		expect(transitions.some((t) => t.to === 'processing')).toBe(true);
	});
});
