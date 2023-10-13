import { Editor, Node, Mark } from "@tiptap/react";
import { useCallback, useEffect } from "react";

// Remove a comment highlight from `data-highlight-id`
export function removeCommentHighlight(
  editor: Editor,
  highlightId: string
): boolean {
  let result = false;

  // Iterate over each mark in the text node and find a match
  editor.state.doc.descendants((node, pos: number) => {
    if (node.isText) {
      node.marks.forEach((mark) => {
        const dataId: string | undefined = mark.attrs.highlightId;

        if (dataId === highlightId && node.text) {
          const from = pos;
          const to = pos + node.text.length;

          // Create and dispatch a transaction to remove the mark
          const transaction = editor.state.tr.removeMark(from, to, mark.type);
          editor.view.dispatch(transaction);
          result = true;
        }
      });
    }
  });

  return result;
}

// Get the mark and node of a comment highlight from `data-highlight-id`
export function getCommentHighlight(
  editor: Editor,
  highlightId: string
): null | { mark: Mark; node: Node } {
  let result = null;

  // Iterate over each mark in the text node and find a matching marl
  editor.state.doc.descendants((node, pos: number) => {
    if (node.isText) {
      node.marks.forEach((mark) => {
        const dataId: string | undefined = mark.attrs.highlightId;

        if (dataId === highlightId) {
          result = { mark, node };
        }
      });
    }
  });

  return result;
}

type HighlightEvent = CustomEvent<{ highlightId: string | null }>;
const HIGHLIGHT_EVENT_NAME = "commentHighlight";

// Trigger highlight active
export function highlightEvent(highlightId: string | null) {
  const event: HighlightEvent = new CustomEvent(HIGHLIGHT_EVENT_NAME, {
    detail: { highlightId },
  });

  console.log("sending", highlightId);

  window.dispatchEvent(event);
}

export function useHighlightEvent() {
  return useCallback((highlightId: string | null) => {
    const event: HighlightEvent = new CustomEvent(HIGHLIGHT_EVENT_NAME, {
      detail: { highlightId },
    });

    window.dispatchEvent(event);
  }, []);
}

export function useHighlightEventListener(
  callback: (highlightId: string | null) => void
) {
  useEffect(() => {
    function handler(event: HighlightEvent) {
      callback(event.detail.highlightId);
    }

    window.addEventListener(HIGHLIGHT_EVENT_NAME, handler as any);

    return () => {
      window.removeEventListener(HIGHLIGHT_EVENT_NAME, handler as any);
    };
  }, [callback]);
}
