import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // log for local debugging
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-destructive/5 rounded-md border border-destructive/20">
          <h3 className="text-lg font-bold">Something went wrong</h3>
          <p className="text-sm text-muted-foreground mt-2">An error occurred while rendering this section.</p>
          <div className="mt-4">
            <button className="btn" onClick={this.handleRetry}>
              Retry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children as JSX.Element;
  }
}
