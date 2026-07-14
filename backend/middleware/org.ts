import { getPrisma } from '../prismaClient.js';

export const getOrgId = async (req: any): Promise<string | undefined | null> => {
  if (req.user.orgId) return req.user.orgId;
  if (req.user.id === 'bypass-admin') return 'bypass-org';
  const profile = await getPrisma().profile.findUnique({
    where: { id: req.user.id }
  });
  return profile?.orgId;
};
