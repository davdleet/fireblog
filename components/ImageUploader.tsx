import { useState } from 'react';
import { auth, storage, STATE_CHANGED } from '../lib/firebase';

import Loader from './Loader';

export default function ImageUploader() {
    //uploading state
    const [uploading, setUploading] = useState(false);
    //upload progress in percentage
    const [progress, setProgress] = useState(0);
    //download url of image
    const [downloadURL, setDownloadURL] = useState(null);

    // Creates a firebase upload task
    const uploadFile = async (e) => {
        // Get the file from the DOM
        const file: any = Array.from(e.target.files)[0];
        const extension = file.type.split('/')[1];

        // Make a reference to the storage bucket location
        const ref = storage.ref(`uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);
        setUploading(true);

        // Starts the upload
        const task = ref.put(file);

        // Listen for updates to upload task
        task.on(STATE_CHANGED, (snapshot) => {
            const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
            setProgress(parseInt(pct));

            // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
            task.then((d) => ref.getDownloadURL()).then((url) => {
                setDownloadURL(url);
                setUploading(false);
            });
        });

        task.then((d) => ref.getDownloadURL()).then((url) => {
            setDownloadURL(url);
            setUploading(false);
        });
    }

    return (
        <div className="box">
            <Loader show={uploading} />
            {uploading && <h3>{progress}%</h3>}
            {!uploading && (
                <>
                    <label className="btn">
                        📸 Upload Image
                        <input type="file" onChange={uploadFile} accept="image/x-png,image/gif,image/jpeg" />
                    </label>
                </>
            )}

            {downloadURL && <code className="upload-snippet">{`![alt](${downloadURL})`}</code>}
        </div>
    )
}