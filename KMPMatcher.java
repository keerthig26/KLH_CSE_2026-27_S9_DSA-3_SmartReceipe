/**
 * KMPMatcher.java
 * Hand-built Knuth-Morris-Pratt string matching (maps to CO2 / Module M2:
 * "linear-time string algorithms ... to solve large-scale pattern-matching
 * problems"). No java.util is used anywhere in this class -- only plain
 * arrays and String/StringBuilder from java.lang.
 *
 * Time complexity:
 *   computeLPS(pattern) : O(m)      m = pattern length
 *   search(text, pattern): O(n + m) n = text length
 * Space complexity: O(m) for the LPS table, O(n) worst case for match storage.
 */
public class KMPMatcher {

    /**
     * Builds the "failure function" / Longest Prefix-Suffix (LPS) array used
     * to skip re-comparisons on a mismatch. lps[i] = length of the longest
     * proper prefix of pattern[0..i] that is also a suffix of pattern[0..i].
     */
    public static int[] computeLPS(String pattern) {
        int m = pattern.length();
        int[] lps = new int[m];
        int len = 0; // length of the previous longest prefix-suffix
        int i = 1;
        lps[0] = 0;

        while (i < m) {
            if (pattern.charAt(i) == pattern.charAt(len)) {
                len++;
                lps[i] = len;
                i++;
            } else if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
        return lps;
    }

    /**
     * Finds every starting index at which `pattern` occurs in `text`.
     * Returns an empty int[] if there is no match. Uses only plain arrays
     * (no ArrayList) -- matches are first counted into a worst-case-sized
     * scratch array, then trimmed by hand into an exact-size result array.
     */
    public static int[] search(String text, String pattern) {
        int n = text.length();
        int m = pattern.length();
        if (m == 0 || m > n) return new int[0];

        int[] lps = computeLPS(pattern);
        int[] scratch = new int[n]; // at most n matches possible
        int count = 0;

        int i = 0; // index into text
        int j = 0; // index into pattern
        while (i < n) {
            if (text.charAt(i) == pattern.charAt(j)) {
                i++;
                j++;
                if (j == m) {
                    scratch[count++] = i - j; // match starts here
                    j = lps[j - 1];
                }
            } else if (j != 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }

        int[] result = new int[count];
        for (int k = 0; k < count; k++) result[k] = scratch[k];
        return result;
    }

    /** Convenience wrapper: does `pattern` occur anywhere in `text`? */
    public static boolean contains(String text, String pattern) {
        return search(text, pattern).length > 0;
    }
}
