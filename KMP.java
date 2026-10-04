import java.io.BufferedReader;
import java.io.InputStreamReader;

public class KMP {

    public static int[] buildLPS(String pattern) {
        int[] lps = new int[pattern.length()];
        int length = 0;
        int i = 1;

        while (i < pattern.length()) {
            if (pattern.charAt(i) == pattern.charAt(length)) {
                length++;
                lps[i] = length;
                i++;
            } else if (length > 0) {
                length = lps[length - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }

        return lps;
    }

    public static boolean contains(String text, String pattern) {
        if (pattern.isEmpty()) {
            return true;
        }

        int[] lps = buildLPS(pattern);

        int i = 0;
        int j = 0;

        while (i < text.length()) {
            if (text.charAt(i) == pattern.charAt(j)) {
                i++;
                j++;

                if (j == pattern.length()) {
                    return true;
                }
            } else if (j > 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }

        return false;
    }

    public static void main(String[] args) throws Exception {
        BufferedReader reader =
                new BufferedReader(new InputStreamReader(System.in));

        String queryLine = reader.readLine();

        if (queryLine == null) {
            return;
        }

        String[] queries = queryLine.toLowerCase().split(",");

        String line;

        while ((line = reader.readLine()) != null) {
            if (line.trim().isEmpty()) {
                continue;
            }

            String[] parts = line.split("\t", 2);

            if (parts.length < 2) {
                continue;
            }

            String id = parts[0];
            String document = parts[1].toLowerCase();

            int matchedCount = 0;

            for (String query : queries) {
                query = query.trim();

                if (!query.isEmpty() && contains(document, query)) {
                    matchedCount++;
                }
            }

            System.out.println(id + "\t" + matchedCount);
        }
    }
}