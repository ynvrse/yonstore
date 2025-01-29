import ActionDialog from '@/components/ActionDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useCategory from '@/hooks/useCategory';
import { Check, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface SelectCategoryProps {
    currentCategory: string;
    onCategoryChange: (category: string) => void;
}

export default function SelectCategory({ currentCategory, onCategoryChange }: SelectCategoryProps) {
    const { categories, addCategory, deleteCategory } = useCategory();

    const [categoryName, setCategoryName] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddCategory = async () => {
        if (!categoryName.trim()) {
            toast.error('Kategori tidak boleh kosong');
            return;
        }

        setIsSubmitting(true);
        await addCategory({ name: categoryName });
        onCategoryChange(categoryName); // Update parent state
        setCategoryName('');
        setIsAddingCategory(false);
    };

    const handleDeleteCategory = async () => {
        if (!currentCategory || currentCategory === 'none') return;
        setIsSubmitting(true);
        await deleteCategory(currentCategory);
        onCategoryChange('none');
    };

    return (
        <div className="space-y-2">
            <Label>Category</Label>
            <div className="flex items-center gap-2">
                {isAddingCategory ? (
                    <div className="flex flex-1 gap-2">
                        <Input
                            type="text"
                            id="category"
                            value={categoryName}
                            placeholder="New Category"
                            onChange={(e) => setCategoryName(e.target.value)}
                            disabled={isSubmitting}
                            autoFocus
                        />
                        <Button type="button" onClick={handleAddCategory} disabled={isSubmitting}>
                            <Check className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="destructive"
                            type="button"
                            onClick={() => {
                                setIsAddingCategory(false);
                                setCategoryName('');
                            }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <>
                        <Select value={currentCategory} onValueChange={onCategoryChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Pilih Kategori</SelectItem>
                                {categories.map(
                                    (category, index) =>
                                        category.name && (
                                            <SelectItem key={index} value={category.name}>
                                                {category.name}
                                            </SelectItem>
                                        ),
                                )}
                                <SelectItem value="void">Kosongkan Kategori</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            type="button"
                            onClick={() => {
                                setIsAddingCategory(true);
                                toast.info('Silahkan Masukan Kategori Baru');
                            }}
                            disabled={isSubmitting}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                        {currentCategory && currentCategory !== 'none' && currentCategory !== 'void' && (
                            <ActionDialog
                                trigger={
                                    <Button variant="destructive" type="button">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                }
                                title="Hapus Kategori"
                                description="Yakin ingin hapus kategori?"
                                action={handleDeleteCategory}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
