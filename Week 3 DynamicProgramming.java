import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;

public class DynamicProgramming {

    public static int maxCoveredIngredients(
            String[] required,
            Set<String> available
    ) {
        int n = required.length;

        if (n == 0) {
            return 0;
        }

        int totalMasks = 1 << n;
        int[] dp = new int[totalMasks];

        int best = 0;

        for (int mask = 1; mask < totalMasks; mask++) {
            int previous = mask & (mask - 1);
            int bit = Integer.numberOfTrailingZeros(mask ^ previous);

            if (available.contains(required[bit])) {
                dp[mask] = dp[previous] + 1;
            } else {
                dp[mask] = dp[previous];
            }

            best = Math.max(best, dp[mask]);
        }

        return best;
    }

    public static void main(String[] args) throws Exception {
        BufferedReader reader =
                new BufferedReader(new InputStreamReader(System.in));

        String availableLine = reader.readLine();

        if (availableLine == null) {
            return;
        }

        Set<String> available = new HashSet<>();

        for (String item : availableLine.split(",")) {
            available.add(item.trim().toLowerCase());
        }

        String line;

        while ((line = reader.readLine()) != null) {
            if (line.trim().isEmpty()) {
                continue;
            }

            String[] parts = line.split("\\t", 2);

            if (parts.length < 2) {
                continue;
            }

            String id = parts[0];

            String[] required =
                    Arrays.stream(parts[1].split(","))
                            .map(String::trim)
                            .map(String::toLowerCase)
                            .toArray(String[]::new);

            int score =
                    maxCoveredIngredients(required, available);

            System.out.println(id + "\t" + score);
        }
    }
}

