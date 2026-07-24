import sys

class FallbackIncidentMemory:
    """
    In-Memory Fallback RAG Store when ChromaDB or embedding models are unavailable.
    """
    def __init__(self):
        self.incidents = [
            {
                "id": "historical_inc_001",
                "document": "High latency on payment-service due to database connection pool exhaustion. 500ms+ latency. Resolved by restarting the payment container.",
                "metadata": {"service": "payment-service", "resolution": "restart", "cost": 0.02},
                "keywords": ["payment", "latency", "connection", "database", "pool", "exhaustion", "500ms"]
            },
            {
                "id": "historical_inc_002",
                "document": "Authentication service 500 error rate due to expired OAuth JWT secret token key. Resolved by refreshing secret token key.",
                "metadata": {"service": "auth-service", "resolution": "rotate_secret", "cost": 0.00},
                "keywords": ["auth", "authentication", "token", "jwt", "secret", "500", "error"]
            }
        ]

    def search_similar_incidents(self, description: str):
        query_words = set(description.lower().split())
        best_match = None
        highest_score = 0

        for inc in self.incidents:
            score = sum(1 for word in query_words if word in inc["keywords"])
            if score > highest_score:
                highest_score = score
                best_match = inc

        if best_match and highest_score > 0:
            return {
                "document": best_match["document"],
                "metadata": best_match["metadata"],
                "score": highest_score
            }
        return None


class IncidentMemory:
    def __init__(self):
        self.use_chroma = False
        self.fallback = FallbackIncidentMemory()
        
        try:
            import chromadb
            from chromadb.config import Settings
            self.client = chromadb.Client(Settings(is_persistent=False))
            self.collection = self.client.get_or_create_collection(name="incident_memory")
            self._seed_chroma()
            self.use_chroma = True
            print("[IncidentMemory] Initialized ChromaDB Vector Memory Engine successfully.")
        except Exception as e:
            print(f"[IncidentMemory] ChromaDB not available ({e}). Using Fallback RAG Engine.")

    def _seed_chroma(self):
        try:
            self.collection.add(
                documents=["High latency on payment-service due to database connection pool exhaustion. 500ms+ latency. Resolved by restarting the payment container."],
                metadatas=[{"service": "payment-service", "resolution": "restart", "cost": 0.02}],
                ids=["historical_inc_001"]
            )
        except Exception:
            pass

    def search_similar_incidents(self, description: str):
        if self.use_chroma:
            try:
                results = self.collection.query(
                    query_texts=[description],
                    n_results=1
                )
                if results and results.get('documents') and len(results['documents'][0]) > 0:
                    return {
                        "document": results['documents'][0][0],
                        "metadata": results['metadatas'][0][0]
                    }
            except Exception as e:
                print(f"[IncidentMemory] ChromaDB query failed ({e}), falling back to memory store.")

        # Always fallback cleanly
        return self.fallback.search_similar_incidents(description)


memory = IncidentMemory()
