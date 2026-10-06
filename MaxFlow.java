import java.util.*;

public class MaxFlow {

    static class Edge {
        int to;
        int capacity;
        int reverse;

        Edge(int to, int capacity, int reverse) {
            this.to = to;
            this.capacity = capacity;
            this.reverse = reverse;
        }
    }

    private final List<List<Edge>> graph;

    public MaxFlow(int vertices) {
        graph = new ArrayList<>();

        for (int i = 0; i < vertices; i++) {
            graph.add(new ArrayList<>());
        }
    }

    // Add a directed edge and its reverse edge
    public void addEdge(int from, int to, int capacity) {
        Edge forward = new Edge(to, capacity, graph.get(to).size());
        Edge backward = new Edge(from, 0, graph.get(from).size());

        graph.get(from).add(forward);
        graph.get(to).add(backward);
    }

    // BFS finds an augmenting path
    private boolean bfs(int source, int sink, int[] parentVertex, int[] parentEdge) {
        Arrays.fill(parentVertex, -1);
        Arrays.fill(parentEdge, -1);

        Queue<Integer> queue = new LinkedList<>();
        queue.add(source);
        parentVertex[source] = source;

        while (!queue.isEmpty()) {
            int current = queue.poll();

            for (int i = 0; i < graph.get(current).size(); i++) {
                Edge edge = graph.get(current).get(i);

                if (edge.capacity > 0 && parentVertex[edge.to] == -1) {
                    parentVertex[edge.to] = current;
                    parentEdge[edge.to] = i;

                    if (edge.to == sink) {
                        return true;
                    }

                    queue.add(edge.to);
                }
            }
        }

        return false;
    }

    // Ford-Fulkerson using BFS (Edmonds-Karp)
    public int calculateMaxFlow(int source, int sink) {
        int maxFlow = 0;

        int[] parentVertex = new int[graph.size()];
        int[] parentEdge = new int[graph.size()];

        while (bfs(source, sink, parentVertex, parentEdge)) {

            int pathFlow = Integer.MAX_VALUE;

            // Find minimum capacity on the path
            for (int current = sink; current != source; current = parentVertex[current]) {
                int previous = parentVertex[current];
                Edge edge = graph.get(previous).get(parentEdge[current]);

                pathFlow = Math.min(pathFlow, edge.capacity);
            }

            // Update residual capacities
            for (int current = sink; current != source; current = parentVertex[current]) {
                int previous = parentVertex[current];
                Edge edge = graph.get(previous).get(parentEdge[current]);

                edge.capacity -= pathFlow;

                Edge reverseEdge = graph.get(current).get(edge.reverse);
                reverseEdge.capacity += pathFlow;
            }

            maxFlow += pathFlow;
        }

        return maxFlow;
    }

    public static void main(String[] args) {

        /*
         * Example:
         *
         * Source
         *   |
         *   +--> Tomato ----+
         *   |               |
         *   +--> Onion -----+--> Recipe Requirement 1
         *                   |
         *   +--> Potato ----+--> Recipe Requirement 2
         *                           |
         *                         Sink
         */

        int source = 0;
        int tomato = 1;
        int onion = 2;
        int potato = 3;

        int requirement1 = 4;
        int requirement2 = 5;

        int sink = 6;

        MaxFlow flow = new MaxFlow(7);

        // Source -> available ingredients
        flow.addEdge(source, tomato, 1);
        flow.addEdge(source, onion, 1);
        flow.addEdge(source, potato, 1);

        // Available ingredients -> recipe requirements
        flow.addEdge(tomato, requirement1, 1);
        flow.addEdge(onion, requirement1, 1);
        flow.addEdge(potato, requirement2, 1);

        // Recipe requirements -> sink
        flow.addEdge(requirement1, sink, 1);
        flow.addEdge(requirement2, sink, 1);

        int result = flow.calculateMaxFlow(source, sink);

        System.out.println("Maximum Flow: " + result);
    }
}
    

