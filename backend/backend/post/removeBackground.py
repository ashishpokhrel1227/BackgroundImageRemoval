from PIL import Image 
from torchvision import transforms

def RemoveBackground(inputImageFile, outputImageFile):
    preprocess = transforms.Compose([
        transforms.ToTensor()
    ])
    postprocess = transforms.Compose([
        transforms.ToPILImage()
    ])
    inputImage = Image.open(inputImageFile)
    outputImage = Image.open(outputImageFile)
    input_rgb = inputImage.convert('RGB')
    input_data = preprocess(input_rgb)
    output_data = preprocess(outputImage)
    output_data_shape = output_data.shape
    
    for i in range(output_data_shape[0]):
        for j in range(output_data_shape[1]):
            for k in range(output_data_shape[2]):
                if output_data[i, j, k] == 0:
                    for x in range(3):
                        input_data[x, j, k] = 1
    
    return postprocess(input_data)

