import React, { useEffect, useState, useCallback } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress,
    Chip,
    Divider,
    Paper,
    Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CommentIcon from "@mui/icons-material/Comment";
import proposalApi from "../../../api/ProposalApi";

interface Comment {
    _id?: string;
    text: string;
    authorName: string;
    role: string;
    createdAt: string;
}

interface CommentsPanelProps {
    proposalId: string;
    proposalType: string;
    onSnackbar?: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

const CommentsPanel: React.FC<CommentsPanelProps> = ({ proposalId, proposalType, onSnackbar }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = useCallback(async () => {
        if (!proposalId || !proposalType) return;
        setLoading(true);
        try {
            const res: any = await proposalApi.getComments(proposalId, proposalType);
            if (res?.status && res.data) {
                setComments(res.data);
            }
        } catch (err) {
            console.error("Error fetching comments:", err);
        } finally {
            setLoading(false);
        }
    }, [proposalId, proposalType]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        setSubmitting(true);
        try {
            const res: any = await proposalApi.addComment(proposalId, newComment.trim(), proposalType);
            if (res?.status) {
                setNewComment("");
                await fetchComments();
                onSnackbar?.("Comment added successfully", "success");
            } else {
                onSnackbar?.("Failed to add comment", "error");
            }
        } catch (err) {
            console.error("Error adding comment:", err);
            onSnackbar?.("Failed to add comment", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN': return '#003893';
            case 'ADMIN': return '#2563eb';
            case 'DIRECTOR': return '#7c3aed';
            default: return '#6b7280';
        }
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { 
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <Paper 
            elevation={2} 
            sx={{ 
                mt: 3, 
                borderRadius: '12px', 
                overflow: 'hidden',
                border: '1px solid rgba(0, 56, 147, 0.12)'
            }}
        >
            {/* Header */}
            <Box sx={{ 
                background: 'linear-gradient(135deg, #003893 0%, #001d4a 100%)',
                px: 3, py: 2,
                display: 'flex', alignItems: 'center', gap: 1.5,
            }}>
                <CommentIcon sx={{ color: '#fff', fontSize: 22 }} />
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
                    Internal Notes
                </Typography>
                <Chip 
                    label={comments.length} 
                    size="small" 
                    sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        color: '#fff', 
                        fontWeight: 700,
                        ml: 1 
                    }} 
                />
            </Box>

            {/* Comment Form */}
            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #e5e7eb' }}>
                <TextField
                    multiline
                    rows={2}
                    fullWidth
                    placeholder="Add an internal note..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) handleAddComment();
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#003893',
                            }
                        }
                    }}
                />
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                    <Typography variant="caption" color="text.secondary">
                        Ctrl+Enter to send
                    </Typography>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || submitting}
                        endIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <SendIcon sx={{ fontSize: 16 }} />}
                        sx={{
                            background: '#003893',
                            color: '#fff',
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: '8px',
                            px: 2.5,
                            '&:hover': {
                                background: '#002a6e',
                            }
                        }}
                    >
                        {submitting ? 'Sending...' : 'Add Note'}
                    </Button>
                </Box>
            </Box>

            {/* Comments List */}
            <Box sx={{ maxHeight: 400, overflowY: 'auto', px: 3, py: 2 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" py={3}>
                        <CircularProgress size={30} sx={{ color: '#003893' }} />
                    </Box>
                ) : comments.length === 0 ? (
                    <Box textAlign="center" py={4}>
                        <CommentIcon sx={{ fontSize: 40, color: '#d1d5db', mb: 1 }} />
                        <Typography color="text.secondary" fontSize="0.875rem">
                            No notes yet. Be the first to add one.
                        </Typography>
                    </Box>
                ) : (
                    comments.map((comment, index) => (
                        <React.Fragment key={comment._id || index}>
                            <Box sx={{ py: 1.5 }}>
                                <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
                                    <Avatar 
                                        sx={{ 
                                            width: 28, height: 28, 
                                            fontSize: '0.75rem', fontWeight: 700,
                                            bgcolor: getRoleColor(comment.role) 
                                        }}
                                    >
                                        {comment.authorName?.[0]?.toUpperCase() || 'U'}
                                    </Avatar>
                                    <Box flex={1}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Typography fontSize="0.8rem" fontWeight={600} color="text.primary">
                                                {comment.authorName || 'Unknown'}
                                            </Typography>
                                            <Chip
                                                label={comment.role}
                                                size="small"
                                                sx={{
                                                    height: 18,
                                                    fontSize: '0.65rem',
                                                    fontWeight: 600,
                                                    bgcolor: `${getRoleColor(comment.role)}15`,
                                                    color: getRoleColor(comment.role),
                                                    borderColor: `${getRoleColor(comment.role)}30`,
                                                    variant: 'outlined',
                                                }}
                                            />
                                        </Box>
                                        <Typography fontSize="0.7rem" color="text.secondary">
                                            {formatDate(comment.createdAt)}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography 
                                    fontSize="0.85rem" 
                                    color="text.primary" 
                                    sx={{ 
                                        ml: 5.5, 
                                        lineHeight: 1.5,
                                        whiteSpace: 'pre-wrap'
                                    }}
                                >
                                    {comment.text}
                                </Typography>
                            </Box>
                            {index < comments.length - 1 && <Divider />}
                        </React.Fragment>
                    ))
                )}
            </Box>
        </Paper>
    );
};

export default CommentsPanel;
