import os
import base64
from PIL import Image
import PIL
# from django.http import HttpResponse
from django.core.files import File
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status 

from .models import Post, Foreground
from .serializers import PostSerializer, ForegroundSerializer
from .segmentImage import SegmentedImage
from .removeBackground import RemoveBackground

class PostView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        data = request.POST.get('image')
        print('data is of type: ', type(data))
        if (type(data) is str): 
            stringSplit = data.split(',')
            img_data = stringSplit[1]
            img_data2byte = bytes(img_data, 'utf-8')
            with open('image.jpg', 'wb') as fh:
                fh.write(base64.decodebytes(img_data2byte))

            segmentedImage = SegmentedImage('image.jpg', 'post/model.pth')
            # print('segmentedImage is: ', segmentedImage)
            segmentedImage.save('segment.jpg')
            segImage = File(open('segment.jpg', 'rb'))
            seg = Post(image=segImage)
            seg.image.save('seg_.jpg', segImage)
            segSerializer = PostSerializer(seg)

            foregroundImage = RemoveBackground('image.jpg', 'segment.jpg')
            foregroundImage.save('foreground.jpg')
            print('foregroundImage is: ', foregroundImage)

            # f = File(open('image.jpg', 'rb'))
            # print('our file is: ', type('image.jpg'))
            # p = Post(image=f)
            # p.image.save('image_.jpg', f)
            # serializer = PostSerializer(p)

            # return HttpResponse(status=201)

            return Response(segSerializer.data, status=status.HTTP_201_CREATED)

        else:
            imageData = request.FILES['image']
            print('our image is: ', type(imageData))
            segmentedImage = SegmentedImage(imageData, 'post/model.pth')
            print('segmented image is: ', segmentedImage)

            img = Image.open(imageData)
            img.save('image.jpg')

            segmentedImage.save('segment.jpg')
            segImage = File(open('segment.jpg', 'rb'))
            seg = Post(image=segImage)
            seg.image.save('seg_.jpg', segImage)
            segSerializer = PostSerializer(seg)

            foregroundImage = RemoveBackground(imageData, 'segment.jpg')
            foregroundImage.save('foreground.jpg')
            print('foregroundImage is: ', foregroundImage)

            # posts_serializer = PostSerializer(data=request.data)

            # if posts_serializer.is_valid():
                # posts_serializer.save()

            return Response(segSerializer.data, status=status.HTTP_201_CREATED)
            
            # else:
            #     print('error', posts_serializer.errors)
            #     return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ForegroundView(APIView):
    # parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        print('hey i am functioning')
        # img = Image.open('image.jpg')
        # print('img is: ', img)
        foreground = File(open('foreground.jpg', 'rb'))

        img_rgb = Image.open(foreground)

        # this is alpha channel
        segment = Image.open('segment.jpg').convert('L').resize(img_rgb.size)

        img_rgba = img_rgb.copy()

        img_rgba.putalpha(segment)
        img_rgba.save('foreground_.png')
        foreground_image = File(open('foreground_.png', 'rb'))


        foreground_img = Foreground(img=foreground_image)
        foreground_img.img.save('foreground_.png', foreground_image)
        foregroundSerializer = ForegroundSerializer(foreground_img)

        return Response(foregroundSerializer.data, status=status.HTTP_200_OK)