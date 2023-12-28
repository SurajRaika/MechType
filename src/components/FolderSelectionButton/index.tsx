import { Button } from '@geist-ui/core'
import { handleFolderSelection } from '../../api/Backend_Api_call';

// Open a selection dialog for directories

const FolderSelectionButton = () => {
  return (
    <div style="margin-top:2rem;" class="center">
      <Button onclick={handleFolderSelection} type="secondary" ghost >Select SoundTrack Folder</Button>
    </div>
  );
};

export default FolderSelectionButton;
