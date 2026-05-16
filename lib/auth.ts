import { prisma } from './prisma';

export async function getUserWithAccess(userId: string, email: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  const isOwner = email === process.env.ADMIN_EMAIL || user.role === 'ADMIN';

  if (isOwner) {
    return {
      ...user,
      isOwner: true,
      effectiveTier: 'STUDIO',
      creditsRemaining: 999999999,
      maxVoices: 999,
      hasCommercialLicense: true,
      canUseAPI: true,
    };
  }

  const creditsRemaining = Math.max(0, user.creditsLimit - user.creditsUsed);

  return {
    ...user,
    isOwner: false,
    effectiveTier: user.subscriptionTier,
    creditsRemaining,
    maxVoices: user.subscriptionTier === 'STUDIO' ? 20 : user.subscriptionTier === 'PRO' ? 5 : 1,
    hasCommercialLicense: user.subscriptionTier !== 'FREE',
    canUseAPI: user.subscriptionTier === 'STUDIO',
  };
}