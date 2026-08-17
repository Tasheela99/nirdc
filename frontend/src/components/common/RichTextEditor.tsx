import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Box, Typography } from "@mui/material";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  label?: string;
  error?: boolean;
  helperText?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter text...",
  height = 200,
  label,
  error = false,
  helperText
}) => {
  // Quill editor modules and formats configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'blockquote'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };
  
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'blockquote',
    'color', 'background'
  ];

  return (
    <Box sx={{ mb: 2 }}>
      {label && (
        <Typography variant="body1" gutterBottom>
          {label}
        </Typography>
      )}
      <Box 
        sx={{ 
          border: error ? '1px solid #d32f2f' : '1px solid rgba(0, 0, 0, 0.23)',
          borderRadius: 1,
          '& .ql-toolbar': {
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            borderBottom: '1px solid rgba(0, 0, 0, 0.23)'
          },
          '& .ql-container': {
            border: 'none',
            fontSize: '1rem',
          }
        }}
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={{
            height: height,
            marginBottom: 50 // Space for the toolbar
          }}
        />
      </Box>
      {error && helperText && (
        <Typography color="error" variant="caption">
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default RichTextEditor;