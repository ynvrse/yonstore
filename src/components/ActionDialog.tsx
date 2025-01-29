import { forwardRef, ReactNode, useEffect, useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './ui/alert-dialog';

interface ActionDialogProps {
    trigger: ReactNode;
    action: () => void | Promise<void>;
    title: string;
    description: string;
}

const ActionDialog = forwardRef<HTMLDivElement, ActionDialogProps>(
    ({ trigger, action, title, description }: ActionDialogProps, ref) => {
        const [isOpen, setIsOpen] = useState(false);

        const handleOpenChange = (open: boolean) => {
            setIsOpen(open);
        };

        const handleAction = async () => {
            try {
                await action();
                setIsOpen(false); // Make sure to close the dialog after the action is done
            } catch (error) {
                console.error('Error while executing action:', error);
            }
        };

        // This will ensure that once the dialog is closed, you can interact with the rest of the page again.
        useEffect(() => {
            if (!isOpen) {
                // Any cleanup or resetting of states can be done here
            }
        }, [isOpen]);

        return (
            <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
                <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
                <AlertDialogContent ref={ref} className="dark:bg-gray-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                        <AlertDialogDescription>{description}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleAction}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    },
);

export default ActionDialog;
