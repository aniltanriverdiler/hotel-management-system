"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Palette,
} from "lucide-react";

interface WysiwygEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  value = "",
  onChange,
  placeholder = "İçeriğinizi buraya yazın...",
}) => {
  const [content, setContent] = useState(value);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onChange?.(newContent);
  };

  const ToolbarButton = ({
    icon: Icon,
    tooltip,
    onClick,
  }: {
    icon: any;
    tooltip: string;
    onClick?: () => void;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 hover:bg-gray-100"
      title={tooltip}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      {/* Menu Bar */}
      <div className="border-b border-gray-200 px-4 py-2">
        <div className="flex items-center space-x-6 text-sm">
          <button className="hover:text-blue-600">File</button>
          <button className="hover:text-blue-600">Edit</button>
          <button className="hover:text-blue-600">Insert</button>
          <button className="hover:text-blue-600">View</button>
          <button className="hover:text-blue-600">Format</button>
          <button className="hover:text-blue-600">Table</button>
          <button className="hover:text-blue-600">Tools</button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-gray-200 px-4 py-2">
        <div className="flex items-center space-x-1">
          {/* Format Dropdown */}
          <select className="mr-2 px-2 py-1 border border-gray-300 rounded text-sm">
            <option>Formats</option>
            <option>Heading 1</option>
            <option>Heading 2</option>
            <option>Paragraph</option>
          </select>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Text Formatting */}
          <ToolbarButton icon={Bold} tooltip="Bold" />
          <ToolbarButton icon={Italic} tooltip="Italic" />
          <ToolbarButton icon={Underline} tooltip="Underline" />

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Alignment */}
          <ToolbarButton icon={AlignLeft} tooltip="Align Left" />
          <ToolbarButton icon={AlignCenter} tooltip="Align Center" />
          <ToolbarButton icon={AlignRight} tooltip="Align Right" />

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Lists */}
          <ToolbarButton icon={List} tooltip="Bullet List" />
          <ToolbarButton icon={ListOrdered} tooltip="Numbered List" />

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Insert */}
          <ToolbarButton icon={Link} tooltip="Insert Link" />
          <ToolbarButton icon={Image} tooltip="Insert Image" />

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Color */}
          <ToolbarButton icon={Type} tooltip="Text Color" />
          <ToolbarButton icon={Palette} tooltip="Background Color" />
        </div>
      </div>

      {/* Editor Area */}
      <div className="p-4">
        <Textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[400px] border-0 resize-none focus:ring-0 focus:outline-none text-base"
        />
      </div>

      {/* Status Bar */}
      <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Words: {content.split(" ").filter((word) => word.length > 0).length}
          </span>
          <span>Path: /</span>
        </div>
      </div>
    </div>
  );
};

export default WysiwygEditor;
