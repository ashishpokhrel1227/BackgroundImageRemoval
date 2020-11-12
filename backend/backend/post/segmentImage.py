import sys, os
import torch
from PIL import Image
from torchvision import transforms

def SegmentedImage(filename, modeldata):
    fcn = torch.load(modeldata)
    fcn.eval()
    input_image = Image.open(filename)
    input_rgb_image = input_image.convert('RGB')
    preprocess = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    input_tensor = preprocess(input_rgb_image)
    input_batch = input_tensor.unsqueeze(0)

    with torch.no_grad():
        output = fcn(input_batch)['out'][0]
    output_predictions = output.argmax(0)
    output_predictions = output_predictions.unsqueeze(0)
    output_predictions = output_predictions.type(torch.FloatTensor)
    postprocess = transforms.Compose([
        transforms.ToPILImage()
    ])
    output_image = postprocess(output_predictions)
    return (output_image)
