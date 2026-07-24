import os
import sys

_otel_initialized = False

def setup_opentelemetry():
    """
    Configure OpenTelemetry to send traces to SigNoz OTLP collector (Cloud or Self-Hosted).
    Failsafe: If packages or endpoint are unavailable, logs status and continues cleanly.
    """
    global _otel_initialized
    
    try:
        from opentelemetry import trace
        from opentelemetry.sdk.trace import TracerProvider
        from opentelemetry.sdk.trace.export import BatchSpanProcessor
        from opentelemetry.sdk.resources import Resource

        # Service Resource Identification
        service_name = os.getenv("OTEL_SERVICE_NAME", "observability-copilot-backend")
        resource = Resource.create({"service.name": service_name})

        # Tracer Provider Setup
        provider = TracerProvider(resource=resource)
        trace.set_tracer_provider(provider)

        # OTLP Endpoint & Header configuration
        endpoint = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "http://localhost:4317")
        headers_raw = os.getenv("OTEL_EXPORTER_OTLP_HEADERS", "")
        ingestion_key = os.getenv("SIGNOZ_INGESTION_KEY", "")

        headers = {}
        if headers_raw:
            # Parse header key=value,key2=value2
            for item in headers_raw.split(","):
                if "=" in item:
                    k, v = item.split("=", 1)
                    headers[k.strip()] = v.strip()
        elif ingestion_key:
            headers["signoz-ingestion-key"] = ingestion_key

        protocol = os.getenv("OTEL_EXPORTER_OTLP_PROTOCOL", "http/protobuf")

        if "http" in protocol or endpoint.startswith("http://") or endpoint.startswith("https://"):
            try:
                from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
                target_url = endpoint if endpoint.endswith("/v1/traces") else f"{endpoint.rstrip('/')}/v1/traces"
                exporter = OTLPSpanExporter(endpoint=target_url, headers=headers)
            except Exception:
                from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
                clean_endpoint = endpoint.replace("http://", "").replace("https://", "")
                exporter = OTLPSpanExporter(endpoint=clean_endpoint, headers=headers, insecure=True)
        else:
            from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
            clean_endpoint = endpoint.replace("http://", "").replace("https://", "")
            exporter = OTLPSpanExporter(endpoint=clean_endpoint, headers=headers, insecure=True)

        span_processor = BatchSpanProcessor(exporter)
        provider.add_span_processor(span_processor)

        _otel_initialized = True
        print(f"[OpenTelemetry] Successfully initialized OTLP Exporter pointing to: {endpoint} (Service: {service_name})")
    
    except ModuleNotFoundError as e:
        print(f"[OpenTelemetry] OTel packages missing ({e}). App running without OTLP trace export.")
    except Exception as e:
        print(f"[OpenTelemetry] OTLP Initialization skipped ({e}). App running in standalone mode.")


def instrument_app(app):
    """
    Instruments FastAPI instance dynamically.
    """
    if not _otel_initialized:
        return
        
    try:
        from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
        FastAPIInstrumentor.instrument_app(app)
        print("[OpenTelemetry] FastAPI instrumented successfully.")
    except Exception as e:
        print(f"[OpenTelemetry] Could not instrument FastAPI app: {e}")

