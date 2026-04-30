'use client';
// components/admin/RichTextEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useEffect, useCallback } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon,
  List, ListOrdered, Quote, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight, Undo, Redo, Image as ImgIcon,
} from 'lucide-react';
import clsx from 'clsx';

interface Props {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder = 'Start writing...' }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ HTMLAttributes: { class: 'rounded-sm max-w-full' } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-amber-600 underline' } }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: 'focus:outline-none min-h-[400px] p-5 text-[#1a1712]' },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content]);

  const insertLink = useCallback(() => {
    const url = window.prompt('Enter URL:');
    if (!url || !editor) return;
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const insertImage = useCallback(() => {
    const url = window.prompt('Image URL:');
    if (!url || !editor) return;
    editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  if (!editor) return <div className="skeleton h-96 rounded-sm" />;

  const ToolBtn = ({
    onClick, active, title, children,
  }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={clsx(
        'p-1.5 rounded-sm transition-all text-sm',
        active
          ? 'bg-[#d97706]/20 text-[#d97706]'
          : 'text-slate-400 hover:text-white hover:bg-[#2a2f3d]'
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-[#2a2f3d] rounded-sm overflow-hidden">
      {/* Toolbar */}
      <div className="bg-[#1a1f2b] border-b border-[#2a2f3d] p-2 flex flex-wrap items-center gap-0.5">
        <ToolBtn title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
          <Bold size={15} />
        </ToolBtn>
        <ToolBtn title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
          <Italic size={15} />
        </ToolBtn>
        <ToolBtn title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')}>
          <UnderlineIcon size={15} />
        </ToolBtn>
        <div className="w-px h-5 bg-[#2a2f3d] mx-1" />
        <ToolBtn title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>
          <Heading2 size={15} />
        </ToolBtn>
        <ToolBtn title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}>
          <Heading3 size={15} />
        </ToolBtn>
        <div className="w-px h-5 bg-[#2a2f3d] mx-1" />
        <ToolBtn title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
          <List size={15} />
        </ToolBtn>
        <ToolBtn title="Ordered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
          <ListOrdered size={15} />
        </ToolBtn>
        <ToolBtn title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}>
          <Quote size={15} />
        </ToolBtn>
        <div className="w-px h-5 bg-[#2a2f3d] mx-1" />
        <ToolBtn title="Align left"   onClick={() => editor.chain().focus().setTextAlign('left').run()}   active={editor.isActive({ textAlign: 'left' })}>   <AlignLeft size={15} /> </ToolBtn>
        <ToolBtn title="Align center" onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })}> <AlignCenter size={15} /> </ToolBtn>
        <ToolBtn title="Align right"  onClick={() => editor.chain().focus().setTextAlign('right').run()}  active={editor.isActive({ textAlign: 'right' })}>  <AlignRight size={15} /> </ToolBtn>
        <div className="w-px h-5 bg-[#2a2f3d] mx-1" />
        <ToolBtn title="Insert link" onClick={insertLink} active={editor.isActive('link')}>
          <LinkIcon size={15} />
        </ToolBtn>
        <ToolBtn title="Insert image" onClick={insertImage}>
          <ImgIcon size={15} />
        </ToolBtn>
        <div className="w-px h-5 bg-[#2a2f3d] mx-1" />
        <ToolBtn title="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={15} />
        </ToolBtn>
        <ToolBtn title="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={15} />
        </ToolBtn>
      </div>

      {/* Editor body */}
      <div className="tiptap-wrapper bg-white min-h-[400px]">
        <EditorContent editor={editor} />
      </div>

      {/* Word count */}
      <div className="bg-[#f8f7f4] border-t border-[#e5e0d8] px-4 py-1.5 text-[10px] text-slate-500 font-mono text-right">
        {editor.storage.characterCount?.words?.() ?? editor.getText().split(/\s+/).filter(Boolean).length} words
      </div>
    </div>
  );
}
