// "Hadiah" pada poster DICARI: bertambah setiap modul selesai dan tes dikumpulkan.
// Murni dekoratif/motivasi — tidak dipakai untuk penilaian.
export const BOUNTY_PER_MODULE = 10_000_000;
export const BOUNTY_PER_TEST = 5_000_000;

/** @param {{ modulesDone: number, testsSubmitted: number }} p */
export function bountyFor({ modulesDone, testsSubmitted }) {
  return modulesDone * BOUNTY_PER_MODULE + testsSubmitted * BOUNTY_PER_TEST;
}

/** Arah jarum kompas (derajat) menuju pulau berikutnya; 7 pulau tersebar di satu lingkaran. */
export function compassAngle(nextIndex, total = 7) {
  return Math.round((360 / total) * nextIndex - 30);
}
