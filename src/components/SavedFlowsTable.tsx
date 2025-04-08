import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PublishIcon from '@mui/icons-material/Publish';
import DraftsIcon from '@mui/icons-material/Drafts';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface SavedFlow {
  id: string;
  name: string;
  date: string;
  thumbnail: string;
  data: string; // JSON string of the flow data
  status?: 'draft' | 'published';
  orderId?: string;
}

interface SavedFlowsTableProps {
  savedFlows: SavedFlow[];
  onDelete: (id: string) => void;
  onLoad: (flowData: string) => void;
  onPublish?: (flow: SavedFlow) => void;
  open: boolean;
  onClose: () => void;
}

const SavedFlowsTable: React.FC<SavedFlowsTableProps> = ({
  savedFlows,
  onDelete,
  onLoad,
  onPublish,
  open,
  onClose
}) => {
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = React.useState(false);

  const handlePreview = (thumbnail: string) => {
    setPreviewImage(thumbnail);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  const handleDownload = (flow: SavedFlow) => {
    // Create a download link for the flow JSON
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(flow.data);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${flow.name}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    // Also download the thumbnail
    const downloadImageNode = document.createElement('a');
    downloadImageNode.setAttribute("href", flow.thumbnail);
    downloadImageNode.setAttribute("download", `${flow.name}.png`);
    document.body.appendChild(downloadImageNode);
    downloadImageNode.click();
    downloadImageNode.remove();
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Saved Flows</Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {savedFlows.length === 0 ? (
            <Box py={3} textAlign="center">
              <Typography variant="body1" color="textSecondary">
                No saved flows yet. Create and save a flow to see it here.
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Preview</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {savedFlows.map((flow) => (
                    <TableRow key={flow.id}>
                      <TableCell>{flow.name}</TableCell>
                      <TableCell>{flow.date}</TableCell>
                      <TableCell>
                        {flow.status === 'published' ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                            <CheckCircleIcon sx={{ mr: 0.5, fontSize: 18 }} />
                            <Typography variant="body2">Published</Typography>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                            <DraftsIcon sx={{ mr: 0.5, fontSize: 18 }} />
                            <Typography variant="body2">Draft</Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box
                          component="img"
                          src={flow.thumbnail}
                          alt={flow.name}
                          sx={{
                            width: 100,
                            height: 60,
                            objectFit: 'cover',
                            cursor: 'pointer',
                            border: '1px solid #eee',
                            borderRadius: 1
                          }}
                          onClick={() => handlePreview(flow.thumbnail)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={() => {
                              onLoad(flow.data);
                              onClose();
                            }}
                          >
                            Load
                          </Button>
                          {onPublish && flow.status !== 'published' && (
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<PublishIcon />}
                              onClick={() => onPublish(flow)}
                              sx={{ bgcolor: '#00968f', '&:hover': { bgcolor: '#007a73' }, color: 'white' }}
                            >
                              Publish
                            </Button>
                          )}
                          {flow.status === 'published' && (
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {
                                // Navigate to order tracking for this flow
                                if (flow.orderId) {
                                  // This would be handled by the parent component
                                  onClose();
                                }
                              }}
                              sx={{ color: '#00968f', borderColor: '#00968f', '&:hover': { borderColor: '#007a73', bgcolor: 'rgba(0, 150, 143, 0.04)' } }}
                            >
                              View Status
                            </Button>
                          )}
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<DownloadIcon />}
                            onClick={() => handleDownload(flow)}
                          >
                            Download
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => onDelete(flow.id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={previewOpen} onClose={handleClosePreview} maxWidth="lg">
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Flow Preview</Typography>
            <IconButton onClick={handleClosePreview} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {previewImage && (
            <Box
              component="img"
              src={previewImage}
              alt="Flow Preview"
              sx={{
                maxWidth: '100%',
                maxHeight: '70vh'
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SavedFlowsTable;
