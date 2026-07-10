export type CheckinResult =
  | { ok: true; shops_visited: number }
  | { ok: false; notInPassport: true }
  | { ok: false; unreachable: true }

export async function checkin(phone: string, shop_slug: string): Promise<CheckinResult> {
  void phone
  void shop_slug
  return { ok: false, unreachable: true }
}

export async function getProgress(phone: string): Promise<string[]> {
  void phone
  return []
}
