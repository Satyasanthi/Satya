import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { Container, Segment } from "semantic-ui-react";
import { FacebookShareButton, WhatsappShareButton, FacebookIcon, WhatsappIcon } from "react-share";
import { useDispatch } from "react-redux";

const SocialShare = ({ productUrl }) => {
  const dispatch = useDispatch();

  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  const handleShareAction = (platform) => {
    console.log(`${platform} shared!`); // Debugging/logging
    dispatch({ type: "SET_Data", payload: false });
  };

  return (
    <div>
      {/* Trigger Dialog */}
      <Button  style={{ padding: "3px", border: "none", borderRadius: "5px", bgcolor:"white"}} onClick={openDialog}>
            <FontAwesomeIcon icon={faShare} size="2x" color="blue" />
      </Button>

      {/* Dialog Box */}
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>Share This Content</DialogTitle>
        <DialogContent>
          {/* Main Share Button */}
          <div style={{ position: "relative", display: "inline-block", marginBottom: "20px" }}>
              <div style={{ marginTop: "10px" }}>
                <Container>
                  <Segment>
                    <FacebookShareButton
                      url={productUrl}
                      quote="Share the content"
                      hashtag="#React"
                      style={{padding:"3px"}}
                      onClick={() => handleShareAction("Facebook")}
                    >
                      <FacebookIcon round={true} size={40} />
                    </FacebookShareButton>
                    <WhatsappShareButton
                      title="Sharing content"
                      url={productUrl}
                      style={{padding:"3px"}}
                      onClick={() => handleShareAction("WhatsApp")}
                    >
                      <WhatsappIcon round={true} size={40} />
                    </WhatsappShareButton>
                  </Segment>
                </Container>
              </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SocialShare;
