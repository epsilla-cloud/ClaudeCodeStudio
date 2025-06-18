# Claude Code Studio - UI Design Specification

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ Title Bar                              [_] [□] [×]      │
├─────────────────────────────────────────────────────────┤
│ Menu Bar: File | Edit | View | Help                    │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌───────────────────────────────────────┐│
│ │ File        │ │ Chat Interface                        ││
│ │ Explorer    │ │ ┌─────────────────────────────────────┐││
│ │             │ │ │ Messages Area                       │││
│ │ 📁 project/ │ │ │ User: Help me fix this bug...       │││
│ │  📄 main.js │ │ │ Claude: I'll help you with that...  │││
│ │  📄 api.ts  │ │ │                                     │││
│ │  📁 src/    │ │ │ [Scrollable message history]       │││
│ │             │ │ └─────────────────────────────────────┘││
│ │             │ │ ┌─────────────────────────────────────┐││
│ │             │ │ │ Input Area                          │││
│ │             │ │ │ Type your message...          [Send]│││
│ │             │ │ └─────────────────────────────────────┘││
│ └─────────────┘ └───────────────────────────────────────┘│
├─────────────────────────────────────────────────────────┤
│ Status Bar: ● Connected | Working on: src/main.js       │
└─────────────────────────────────────────────────────────┘
```

## Color Scheme (Dark Theme)
- Background: #1e1e1e
- Sidebar: #252526  
- Chat background: #1e1e1e
- User messages: #0e4429
- Assistant messages: #1f2937
- Accent: #007acc
- Text: #cccccc
- Secondary text: #969696

## Components Breakdown

### 1. Chat Interface
- Message bubbles with syntax highlighting
- File references as clickable chips
- Tool execution indicators
- Streaming response animation

### 2. File Explorer
- Tree view with expand/collapse
- File type icons
- Context menu (right-click)
- Search functionality

### 3. Settings Panel (Modal)
- API key configuration
- Theme selection
- Font size/family
- Auto-save preferences

### 4. Terminal Output Panel (Optional)
- Collapsible bottom panel
- Command history
- Output formatting