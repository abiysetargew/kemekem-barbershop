"use client";
import { Component, ReactNode } from "react";

export class BookingErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("[BOOKING ERROR]", error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-8 text-sm">
          <h2 className="font-display text-2xl text-red-300">Booking error</h2>
          <pre className="mt-4 max-h-96 overflow-auto rounded-lg bg-black/40 p-4 text-xs whitespace-pre-wrap">
            {this.state.error.message}
            {"\n\n"}
            {this.state.error.stack}
          </pre>
          <button
            onClick={() => this.setState({ error: null })}
            className="mt-4 rounded-full bg-foreground px-4 py-2 text-xs text-background"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}