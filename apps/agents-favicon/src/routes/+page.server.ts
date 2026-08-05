import { listAgentsWithIcons, serializeAgent, lastUpdatedAt } from '$lib/server/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const entries = listAgentsWithIcons();
	return {
		agents: entries.map(serializeAgent),
		updatedAt: lastUpdatedAt()
	};
};
